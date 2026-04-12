package middleware

import (
	"bufio"
	"net"
	"net/http"

	"github.com/QuantumNous/new-api/common"
	"github.com/gin-gonic/gin"
)

type AuditResponseWriter struct {
	gin.ResponseWriter
	state *common.RequestAuditState
}

func NewAuditResponseWriter(writer gin.ResponseWriter, state *common.RequestAuditState) *AuditResponseWriter {
	return &AuditResponseWriter{
		ResponseWriter: writer,
		state:          state,
	}
}

func (w *AuditResponseWriter) WriteHeader(code int) {
	if w.state != nil {
		w.state.CaptureClientResponse(w.Header(), nil)
	}
	w.ResponseWriter.WriteHeader(code)
}

func (w *AuditResponseWriter) Write(data []byte) (int, error) {
	if w.state != nil {
		w.state.CaptureClientResponse(w.Header(), data)
	}
	return w.ResponseWriter.Write(data)
}

func (w *AuditResponseWriter) WriteString(s string) (int, error) {
	if w.state != nil {
		w.state.CaptureClientResponse(w.Header(), []byte(s))
	}
	return w.ResponseWriter.WriteString(s)
}

func (w *AuditResponseWriter) WriteHeaderNow() {
	if w.state != nil {
		w.state.CaptureClientResponse(w.Header(), nil)
	}
	w.ResponseWriter.WriteHeaderNow()
}

func (w *AuditResponseWriter) Hijack() (net.Conn, *bufio.ReadWriter, error) {
	return w.ResponseWriter.Hijack()
}

func (w *AuditResponseWriter) Flush() {
	w.ResponseWriter.Flush()
}

func (w *AuditResponseWriter) Pusher() http.Pusher {
	if pusher, ok := w.ResponseWriter.(http.Pusher); ok {
		return pusher
	}
	return nil
}
