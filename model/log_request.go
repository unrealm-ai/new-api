package model

import (
	"errors"

	"github.com/QuantumNous/new-api/common"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

type auditLargeText string

func (auditLargeText) GormDataType() string {
	return "text"
}

func (auditLargeText) GormDBDataType(db *gorm.DB, _ *schema.Field) string {
	switch db.Dialector.Name() {
	case "mysql":
		return "longtext"
	case "postgres", "sqlite":
		return "text"
	default:
		return "text"
	}
}

type LogRequest struct {
	Id                  int            `json:"id"`
	LogID               int            `json:"log_id" gorm:"uniqueIndex;not null"`
	RequestID           string         `json:"request_id" gorm:"type:varchar(64);index"`
	UpstreamURL         string         `json:"upstream_url" gorm:"type:text"`
	RetryCount          int            `json:"retry_count" gorm:"type:int;default:0"`
	ClientRequestRaw    auditLargeText `json:"client_request_raw"`
	UpstreamRequestRaw  auditLargeText `json:"upstream_request_raw"`
	UpstreamResponseRaw auditLargeText `json:"upstream_response_raw"`
	ClientResponseRaw   auditLargeText `json:"client_response_raw"`
	CreatedAt           int64          `json:"created_at" gorm:"bigint"`
	UpdatedAt           int64          `json:"updated_at" gorm:"bigint"`
}

func (LogRequest) TableName() string {
	return "log_request_audit"
}

func (r *LogRequest) BeforeCreate(_ *gorm.DB) error {
	now := common.GetTimestamp()
	r.CreatedAt = now
	r.UpdatedAt = now
	return nil
}

func (r *LogRequest) BeforeUpdate(_ *gorm.DB) error {
	r.UpdatedAt = common.GetTimestamp()
	return nil
}

func UpsertLogRequest(record *LogRequest) error {
	if record == nil || record.LogID <= 0 {
		return nil
	}
	var existing LogRequest
	err := DB.Where("log_id = ?", record.LogID).First(&existing).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return DB.Create(record).Error
		}
		return err
	}
	existing.RequestID = record.RequestID
	existing.UpstreamURL = record.UpstreamURL
	existing.RetryCount = record.RetryCount
	existing.ClientRequestRaw = record.ClientRequestRaw
	existing.UpstreamRequestRaw = record.UpstreamRequestRaw
	existing.UpstreamResponseRaw = record.UpstreamResponseRaw
	existing.ClientResponseRaw = record.ClientResponseRaw
	return DB.Save(&existing).Error
}

func GetLogRequestByLogID(logID int) (*LogRequest, error) {
	var record LogRequest
	err := DB.Where("log_id = ?", logID).First(&record).Error
	if err != nil {
		return nil, err
	}
	return &record, nil
}

func PersistLogRequestFromState(state *common.RequestAuditState) error {
	if state == nil || state.IsPersisted() {
		return nil
	}
	logID, requestID, upstreamURL, retryCount, clientRequestRaw, upstreamRequestRaw, upstreamResponseRaw := state.Snapshot()
	if logID <= 0 {
		return nil
	}
	record := &LogRequest{
		LogID:               logID,
		RequestID:           requestID,
		UpstreamURL:         upstreamURL,
		RetryCount:          retryCount,
		ClientRequestRaw:    auditLargeText(clientRequestRaw),
		UpstreamRequestRaw:  auditLargeText(upstreamRequestRaw),
		UpstreamResponseRaw: auditLargeText(upstreamResponseRaw),
		ClientResponseRaw:   auditLargeText(state.BuildClientResponseRaw()),
	}
	if err := UpsertLogRequest(record); err != nil {
		return err
	}
	state.MarkPersisted()
	return nil
}

func PersistLogRequestFromContext(c *gin.Context) error {
	state := common.GetRequestAuditState(c)
	return PersistLogRequestFromState(state)
}
