/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useEffect, useState, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { getFooterHTML, getLogo, getSystemName } from '../../helpers';
import { StatusContext } from '../../context/Status';

const FooterBar = () => {
  const { t } = useTranslation();
  const [footer, setFooter] = useState(getFooterHTML());
  const systemName = getSystemName();
  const logo = getLogo();
  const [statusState] = useContext(StatusContext);
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;

  const loadFooter = () => {
    let footer_html = localStorage.getItem('footer_html');
    if (footer_html) {
      setFooter(footer_html);
    }
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = useMemo(
    () => [
      {
        title: t('关于我们'),
        links: [
          {
            label: t('关于项目'),
            href: 'https://docs.newapi.pro/wiki/project-introduction/',
          },
          {
            label: t('联系我们'),
            href: 'https://docs.newapi.pro/support/community-interaction/',
          },
          {
            label: t('功能特性'),
            href: 'https://docs.newapi.pro/wiki/features-introduction/',
          },
        ],
      },
      {
        title: t('文档'),
        links: [
          {
            label: t('快速开始'),
            href: 'https://docs.newapi.pro/getting-started/',
          },
          {
            label: t('安装指南'),
            href: 'https://docs.newapi.pro/installation/',
          },
          { label: t('API 文档'), href: 'https://docs.newapi.pro/api/' },
        ],
      },
      {
        title: t('相关项目'),
        links: [
          {
            label: 'One API',
            href: 'https://github.com/songquanpeng/one-api',
          },
          {
            label: 'Midjourney-Proxy',
            href: 'https://github.com/novicezk/midjourney-proxy',
          },
          {
            label: 'neko-api-key-tool',
            href: 'https://github.com/Calcium-Ion/neko-api-key-tool',
          },
        ],
      },
      {
        title: t('友情链接'),
        links: [
          {
            label: 'new-api-horizon',
            href: 'https://github.com/Calcium-Ion/new-api-horizon',
          },
          { label: 'CoAI', href: 'https://github.com/coaidev/coai' },
          { label: 'GPT-Load', href: 'https://www.gpt-load.com/' },
        ],
      },
    ],
    [t],
  );

  const customFooter = useMemo(
    () => (
      <footer
        className='w-full border-t'
        style={{
          backgroundColor: 'var(--landing-bg-1)',
          borderColor: 'var(--landing-border)',
        }}
      >
        <div className='max-w-[1400px] mx-auto px-6 md:px-8'>
          {isDemoSiteMode && (
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8 py-12 md:py-16'>
              {footerLinks.map((section) => (
                <div key={section.title}>
                  <h4
                    className='text-sm font-semibold mb-4 tracking-wide'
                    style={{ color: 'var(--landing-text-0)' }}
                  >
                    {section.title}
                  </h4>
                  <ul className='space-y-3'>
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='landing-link text-sm'
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Bottom bar */}
          <div
            className='flex flex-col md:flex-row items-center justify-between gap-4 py-6 border-t'
            style={{ borderColor: 'var(--landing-border)' }}
          >
            <div className='flex items-center gap-3'>
              {logo && (
                <img
                  src={logo}
                  alt={systemName}
                  className='w-6 h-6 rounded-md object-contain'
                />
              )}
              <span
                className='text-sm'
                style={{ color: 'var(--landing-text-3)' }}
              >
                &copy; {currentYear} {systemName}
              </span>
            </div>

            <div
              className='text-sm'
              style={{ color: 'var(--landing-text-3)' }}
            >
              <span>{t('设计与开发由')} </span>
              <a
                href='https://github.com/QuantumNous/new-api'
                target='_blank'
                rel='noopener noreferrer'
                className='font-medium hover:underline'
                style={{ color: 'var(--landing-brand)' }}
              >
                New API
              </a>
            </div>
          </div>
        </div>
      </footer>
    ),
    [logo, systemName, t, currentYear, isDemoSiteMode, footerLinks],
  );

  useEffect(() => {
    loadFooter();
  }, []);

  return (
    <div className='w-full'>
      {footer ? (
        <div className='relative'>
          <div
            className='custom-footer'
            dangerouslySetInnerHTML={{ __html: footer }}
          ></div>
          <div className='absolute bottom-2 right-4 text-xs opacity-70' style={{ color: 'var(--landing-text-3)' }}>
            <span>{t('设计与开发由')} </span>
            <a
              href='https://github.com/QuantumNous/new-api'
              target='_blank'
              rel='noopener noreferrer'
              className='font-medium'
              style={{ color: 'var(--landing-brand)' }}
            >
              New API
            </a>
          </div>
        </div>
      ) : (
        customFooter
      )}
    </div>
  );
};

export default FooterBar;
