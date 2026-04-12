import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Empty,
  Modal,
  Space,
  TabPane,
  Tabs,
  Typography,
} from '@douyinfe/semi-ui';
import { IconCopy } from '@douyinfe/semi-icons';
import { copy, showError, showSuccess } from '../../../../helpers';

const formatPayload = (payload) => {
  if (payload === null || payload === undefined || payload === '') {
    return '';
  }

  if (typeof payload === 'string') {
    try {
      return JSON.stringify(JSON.parse(payload), null, 2);
    } catch (error) {
      return payload;
    }
  }

  try {
    return JSON.stringify(payload, null, 2);
  } catch (error) {
    return String(payload);
  }
};

const buildPanes = (data, t) => [
  {
    key: 'client-request',
    label: t('用户请求'),
    value: formatPayload(data?.client_request_raw),
  },
  {
    key: 'upstream-request',
    label: t('上游请求'),
    value: formatPayload(data?.upstream_request_raw),
  },
  {
    key: 'upstream-response',
    label: t('上游响应'),
    value: formatPayload(data?.upstream_response_raw),
  },
  {
    key: 'client-response',
    label: t('用户响应'),
    value: formatPayload(data?.client_response_raw),
  },
];

const PayloadPanel = ({ value, t }) => {
  if (!value) {
    return <Empty description={t('暂无归档内容')} style={{ padding: '40px 0' }} />;
  }

  return (
    <div
      style={{
        maxHeight: '55vh',
        overflow: 'auto',
        borderRadius: 12,
        border: '1px solid var(--semi-color-border)',
        background: 'var(--semi-color-fill-0)',
        padding: 16,
      }}
    >
      <pre
        style={{
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontSize: 12,
          lineHeight: 1.6,
          fontFamily:
            'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace',
        }}
      >
        {value}
      </pre>
    </div>
  );
};

const RequestAuditModal = ({
  showRequestAuditModal,
  closeRequestAuditModal,
  requestAuditLoading,
  requestAuditTarget,
  requestAuditData,
  t,
}) => {
  const [activeKey, setActiveKey] = useState('client-request');

  useEffect(() => {
    if (!showRequestAuditModal) {
      setActiveKey('client-request');
    }
  }, [showRequestAuditModal]);

  const panes = useMemo(() => {
    return buildPanes(requestAuditData, t);
  }, [requestAuditData, t]);

  const activePane = panes.find((pane) => pane.key === activeKey) || panes[0];

  const handleCopy = async () => {
    if (!activePane?.value) {
      return;
    }
    if (await copy(activePane.value)) {
      showSuccess(t('请求详情已复制'));
      return;
    }
    showError(t('无法复制到剪贴板，请手动复制'));
  };

  return (
    <Modal
      title={t('请求详情')}
      visible={showRequestAuditModal}
      onCancel={closeRequestAuditModal}
      footer={null}
      width={960}
      centered
      maskClosable
    >
      <div style={{ padding: '4px 4px 16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 12,
            marginBottom: 12,
          }}
        >
          <Space vertical align='start' spacing={4}>
            {requestAuditTarget?.request_id ? (
              <Typography.Text type='tertiary' size='small'>
                {t('Request ID')}: {requestAuditTarget.request_id}
              </Typography.Text>
            ) : null}
            {requestAuditData?.upstream_url ? (
              <Typography.Text type='tertiary' size='small'>
                {t('上游地址')}: {requestAuditData.upstream_url}
              </Typography.Text>
            ) : null}
            {typeof requestAuditData?.retry_count === 'number' ? (
              <Typography.Text type='tertiary' size='small'>
                {t('重试次数')}: {requestAuditData.retry_count}
              </Typography.Text>
            ) : null}
          </Space>
          <Button
            icon={<IconCopy />}
            theme='borderless'
            type='tertiary'
            size='small'
            onClick={handleCopy}
            disabled={!activePane?.value}
          >
            {t('复制当前内容')}
          </Button>
        </div>

        <Tabs type='card' activeKey={activeKey} onChange={setActiveKey}>
          {panes.map((pane) => (
            <TabPane tab={pane.label} itemKey={pane.key} key={pane.key}>
              {requestAuditLoading ? (
                <div
                  style={{
                    minHeight: 240,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--semi-color-text-2)',
                  }}
                >
                  {t('加载中...')}
                </div>
              ) : (
                <PayloadPanel value={pane.value} t={t} />
              )}
            </TabPane>
          ))}
        </Tabs>
      </div>
    </Modal>
  );
};

export default RequestAuditModal;