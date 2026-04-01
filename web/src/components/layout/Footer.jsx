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

// SVG icon components for social media
const IconGithub = () => (
  <svg viewBox='0 0 24 24' width='20' height='20' fill='currentColor'>
    <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
  </svg>
);

const IconTwitter = () => (
  <svg viewBox='0 0 24 24' width='20' height='20' fill='currentColor'>
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
);

const IconDiscord = () => (
  <svg viewBox='0 0 24 24' width='20' height='20' fill='currentColor'>
    <path d='M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z' />
  </svg>
);

const IconEmail = () => (
  <svg viewBox='0 0 24 24' width='16' height='16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <rect x='2' y='4' width='20' height='16' rx='2' />
    <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
  </svg>
);

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

  const socialLinks = useMemo(
    () => [
      {
        icon: <IconGithub />,
        href: 'https://github.com/QuantumNous/new-api',
        label: 'GitHub',
      },
      {
        icon: <IconTwitter />,
        href: '#',
        label: 'Twitter',
      },
      {
        icon: <IconDiscord />,
        href: '#',
        label: 'Discord',
      },
    ],
    [],
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
          <div className='grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 py-12 md:py-16'>
              {/* Left section: Brand info */}
              <div className='md:col-span-4 space-y-6'>
                {/* Logo & system name */}
                <div className='flex items-center gap-3'>
                  {logo && (
                    <img
                      src={logo}
                      alt={systemName}
                      className='w-8 h-8 rounded-md object-contain'
                    />
                  )}
                  <span
                    className='text-lg font-semibold'
                    style={{ color: 'var(--landing-text-0)' }}
                  >
                    {systemName}
                  </span>
                </div>

                {/* Tagline */}
                <p
                  className='text-sm leading-relaxed'
                  style={{ color: 'var(--landing-text-2)' }}
                >
                  {t('稳定，品质。')}
                </p>

                {/* Contact info */}
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <IconEmail />
                    <a
                      href='mailto:weizhilingyu01@163.com'
                      className='landing-link text-sm'
                    >
                      weizhilingyu01@163.com
                    </a>
                  </div>
                </div>

                {/* Social icons */}
                <div className='flex items-center gap-3'>
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label={social.label}
                      className='flex items-center justify-center w-9 h-9 rounded-lg transition-colors'
                      style={{
                        color: 'var(--landing-text-3)',
                        backgroundColor: 'var(--landing-bg-2)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--landing-text-0)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--landing-text-3)';
                      }}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Right section: Link columns */}
              <div className='md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8'>
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
            </div>

          {/* Bottom bar */}
          <div
            className='flex flex-col md:flex-row items-center justify-between gap-4 py-6 border-t'
            style={{ borderColor: 'var(--landing-border)' }}
          >
            <div className='flex items-center gap-4'>
              <a
                href='#'
                className='landing-link text-xs'
              >
                {t('隐私协议')}
              </a>
              <a
                href='#'
                className='landing-link text-xs'
              >
                {t('服务条款')}
              </a>
            </div>

            <div className='flex items-center gap-3'>
              {logo && (
                <img
                  src={logo}
                  alt={systemName}
                  className='w-5 h-5 rounded-md object-contain'
                />
              )}
              <span
                className='text-xs'
                style={{ color: 'var(--landing-text-3)' }}
              >
                Copyright &copy; {currentYear} {systemName} All Rights Reserved
              </span>
            </div>
          </div>
        </div>
      </footer>
    ),
    [logo, systemName, t, currentYear, footerLinks, socialLinks],
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
        </div>
      ) : (
        customFooter
      )}
    </div>
  );
};

export default FooterBar;
