package service

import (
	"bytes"
	"io"
	"net/http"
	"sync"

	"github.com/QuantumNous/new-api/common"
)

type auditTransport struct {
	base http.RoundTripper
}

func newAuditTransport(base http.RoundTripper) http.RoundTripper {
	if base == nil {
		base = http.DefaultTransport
	}
	return &auditTransport{base: base}
}

func (t *auditTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	state := common.GetRequestAuditStateFromContext(req.Context())
	if state != nil {
		state.SetUpstreamURL(req.URL.String())
		body, err := common.CloneBodyForAudit(req)
		if err == nil {
			state.SetUpstreamRequestRaw(common.BuildRequestAuditRaw(req.Header.Clone(), body))
		}
	}

	resp, err := t.base.RoundTrip(req)
	if err != nil || resp == nil || state == nil || resp.Body == nil {
		return resp, err
	}
	resp.Body = &auditResponseBody{
		ReadCloser: resp.Body,
		state:      state,
		headers:    resp.Header.Clone(),
	}
	return resp, err
}

type auditResponseBody struct {
	io.ReadCloser
	state   *common.RequestAuditState
	headers http.Header

	mu     sync.Mutex
	buffer bytes.Buffer
	closed bool
}

func (b *auditResponseBody) Read(p []byte) (int, error) {
	n, err := b.ReadCloser.Read(p)
	if n > 0 {
		b.mu.Lock()
		commonData := p[:n]
		limit := common.GetRequestAuditMaxBodyBytes()
		remaining := limit - b.buffer.Len()
		if remaining > 0 {
			if len(commonData) > remaining {
				commonData = commonData[:remaining]
			}
			_, _ = b.buffer.Write(commonData)
		}
		b.mu.Unlock()
	}
	return n, err
}

func (b *auditResponseBody) Close() error {
	b.mu.Lock()
	if !b.closed {
		b.closed = true
		b.state.SetUpstreamResponseRaw(common.BuildRequestAuditRaw(b.headers, b.buffer.Bytes()))
	}
	b.mu.Unlock()
	return b.ReadCloser.Close()
}
