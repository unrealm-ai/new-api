package common

import (
	"bytes"
	"context"
	"io"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
)

const KeyRequestAuditState = "key_request_audit_state"

type requestAuditContextKey struct{}

type RequestAuditState struct {
	mu sync.Mutex

	LogID               int
	Persisted           bool
	RequestID           string
	UpstreamURL         string
	RetryCount          int
	ClientRequestRaw    string
	UpstreamRequestRaw  string
	UpstreamResponseRaw string

	clientResponseHeader http.Header
	clientResponseBody   bytes.Buffer
}

func NewRequestAuditState(requestID string) *RequestAuditState {
	return &RequestAuditState{
		RequestID:            requestID,
		clientResponseHeader: make(http.Header),
	}
}

func AttachRequestAuditState(c *gin.Context, state *RequestAuditState) {
	if c == nil || state == nil {
		return
	}
	c.Set(KeyRequestAuditState, state)
	if c.Request != nil {
		ctx := context.WithValue(c.Request.Context(), requestAuditContextKey{}, state)
		c.Request = c.Request.WithContext(ctx)
	}
}

func GetRequestAuditState(c *gin.Context) *RequestAuditState {
	if c == nil {
		return nil
	}
	value, exists := c.Get(KeyRequestAuditState)
	if !exists || value == nil {
		return nil
	}
	state, _ := value.(*RequestAuditState)
	return state
}

func GetRequestAuditStateFromContext(ctx context.Context) *RequestAuditState {
	if ctx == nil {
		return nil
	}
	value := ctx.Value(requestAuditContextKey{})
	state, _ := value.(*RequestAuditState)
	return state
}

func (s *RequestAuditState) SetLogID(logID int) {
	if s == nil || logID <= 0 {
		return
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.LogID = logID
}

func (s *RequestAuditState) SetRetryCount(retryCount int) {
	if s == nil || retryCount < 0 {
		return
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.RetryCount = retryCount
}

func (s *RequestAuditState) SetUpstreamURL(url string) {
	if s == nil {
		return
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.UpstreamURL = url
}

func (s *RequestAuditState) SetClientRequestRaw(raw string) {
	if s == nil {
		return
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.ClientRequestRaw = raw
}

func (s *RequestAuditState) SetUpstreamRequestRaw(raw string) {
	if s == nil {
		return
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.UpstreamRequestRaw = raw
}

func (s *RequestAuditState) SetUpstreamResponseRaw(raw string) {
	if s == nil {
		return
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.UpstreamResponseRaw = raw
}

func (s *RequestAuditState) CaptureClientResponse(headers http.Header, bodyChunk []byte) {
	if s == nil {
		return
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	if headers != nil {
		s.clientResponseHeader = headers.Clone()
	}
	appendLimited(&s.clientResponseBody, bodyChunk, GetRequestAuditMaxBodyBytes())
}

func (s *RequestAuditState) BuildClientResponseRaw() string {
	if s == nil {
		return ""
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	return BuildRequestAuditRaw(s.clientResponseHeader, s.clientResponseBody.Bytes())
}

func (s *RequestAuditState) IsPersisted() bool {
	if s == nil {
		return false
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.Persisted
}

func (s *RequestAuditState) MarkPersisted() {
	if s == nil {
		return
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.Persisted = true
}

func (s *RequestAuditState) Snapshot() (logID int, requestID string, upstreamURL string, retryCount int, clientRequestRaw string, upstreamRequestRaw string, upstreamResponseRaw string) {
	if s == nil {
		return 0, "", "", 0, "", "", ""
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.LogID, s.RequestID, s.UpstreamURL, s.RetryCount, s.ClientRequestRaw, s.UpstreamRequestRaw, s.UpstreamResponseRaw
}

func CaptureClientRequestRaw(c *gin.Context) error {
	state := GetRequestAuditState(c)
	if state == nil {
		return nil
	}
	storage, err := GetBodyStorage(c)
	if err != nil {
		return err
	}
	body, err := storage.Bytes()
	if err != nil {
		return err
	}
	state.SetClientRequestRaw(BuildRequestAuditRaw(c.Request.Header.Clone(), body))
	return nil
}

func GetRequestAuditMaxBodyBytes() int {
	maxMB := GetEnvOrDefault("REQUEST_AUDIT_MAX_BODY_MB", 16)
	if maxMB <= 0 {
		maxMB = 16
	}
	return maxMB << 20
}

func BuildRequestAuditRaw(headers http.Header, body []byte) string {
	payload := map[string]any{
		"header": normalizeHeaderMap(headers),
		"body":   decodeAuditBody(body),
	}
	jsonBytes, err := Marshal(payload)
	if err != nil {
		return string(body)
	}
	return string(jsonBytes)
}

func normalizeHeaderMap(headers http.Header) map[string]any {
	if headers == nil {
		return map[string]any{}
	}
	result := make(map[string]any, len(headers))
	for key, values := range headers {
		cloned := make([]string, len(values))
		copy(cloned, values)
		result[key] = cloned
	}
	return result
}

func decodeAuditBody(body []byte) any {
	if len(body) == 0 {
		return ""
	}
	limited := limitBytes(body, GetRequestAuditMaxBodyBytes())
	var decoded any
	if err := Unmarshal(limited, &decoded); err == nil {
		return decoded
	}
	return string(limited)
}

func appendLimited(buf *bytes.Buffer, chunk []byte, limit int) {
	if buf == nil || len(chunk) == 0 || limit <= 0 {
		return
	}
	remaining := limit - buf.Len()
	if remaining <= 0 {
		return
	}
	if len(chunk) > remaining {
		chunk = chunk[:remaining]
	}
	_, _ = buf.Write(chunk)
}

func limitBytes(data []byte, limit int) []byte {
	if limit <= 0 || len(data) <= limit {
		return data
	}
	clipped := make([]byte, limit)
	copy(clipped, data[:limit])
	return clipped
}

func CloneBodyForAudit(req *http.Request) ([]byte, error) {
	if req == nil || req.Body == nil {
		return nil, nil
	}
	body, err := io.ReadAll(req.Body)
	if err != nil {
		return nil, err
	}
	req.Body = io.NopCloser(bytes.NewReader(body))
	req.GetBody = func() (io.ReadCloser, error) {
		return io.NopCloser(bytes.NewReader(body)), nil
	}
	return limitBytes(body, GetRequestAuditMaxBodyBytes()), nil
}
