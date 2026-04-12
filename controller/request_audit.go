package controller

import (
	"errors"
	"strconv"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetRequestAudit(c *gin.Context) {
	logID, err := strconv.Atoi(c.Param("id"))
	if err != nil || logID <= 0 {
		c.JSON(200, gin.H{
			"success": false,
			"message": "无效的日志 ID",
		})
		return
	}

	logRecord, err := model.GetLogByID(logID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(200, gin.H{
				"success": false,
				"message": "日志不存在",
			})
			return
		}
		common.ApiError(c, err)
		return
	}

	currentUserID := c.GetInt("id")
	currentRole := c.GetInt("role")
	if currentRole < common.RoleAdminUser && logRecord.UserId != currentUserID {
		c.JSON(200, gin.H{
			"success": false,
			"message": "无权查看该请求详情",
		})
		return
	}

	record, err := model.GetLogRequestByLogID(logID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(200, gin.H{
				"success": false,
				"message": "该日志暂无请求详情归档",
			})
			return
		}
		common.ApiError(c, err)
		return
	}

	common.ApiSuccess(c, record)
}
