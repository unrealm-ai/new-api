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

import React, { useState, useEffect, useContext } from "react";
import { Select, Typography } from "@douyinfe/semi-ui";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { API, showSuccess, showError } from "../../../../helpers";
import { UserContext } from "../../../../context/User";
import { normalizeLanguage } from "../../../../i18n/language";

// Language options with native names
const languageOptions = [
	{ value: "zh-CN", label: "简体中文" },
	{ value: "zh-TW", label: "繁體中文" },
	{ value: "en", label: "English" },
	{ value: 'fr', label: 'Français'},
	{ value: 'ru', label: 'Русский'},
	{ value: 'ja', label: '日本語'},
	{ value: "vi", label: "Tiếng Việt" },
];

const PreferencesSettings = ({ t }) => {
	const { i18n } = useTranslation();
	const [userState, userDispatch] = useContext(UserContext);
	const [currentLanguage, setCurrentLanguage] = useState(
		normalizeLanguage(i18n.language) || "zh-CN",
	);
	const [loading, setLoading] = useState(false);

	// Load saved language preference from user settings
	useEffect(() => {
		if (userState?.user?.setting) {
			try {
				const settings = JSON.parse(userState.user.setting);
				if (settings.language) {
					const lang = normalizeLanguage(settings.language);
					setCurrentLanguage(lang);
					// Sync i18n with saved preference
					if (i18n.language !== lang) {
						i18n.changeLanguage(lang);
					}
				}
			} catch (e) {
				// Ignore parse errors
			}
		}
	}, [userState?.user?.setting, i18n]);

	const handleLanguagePreferenceChange = async (lang) => {
		if (lang === currentLanguage) return;

		setLoading(true);
		const previousLang = currentLanguage;

		try {
			// Update language immediately for responsive UX
			setCurrentLanguage(lang);
			i18n.changeLanguage(lang);
			localStorage.setItem('i18nextLng', lang);

			// Save to backend
			const res = await API.put("/api/user/self", {
				language: lang,
			});

			if (res.data.success) {
				showSuccess(t("语言偏好已保存"));
				// Keep backend preference, context state, and local cache aligned.
				let settings = {};
				if (userState?.user?.setting) {
					try {
						settings = JSON.parse(userState.user.setting) || {};
					} catch (e) {
						settings = {};
					}
				}
				settings.language = lang;
				const nextUser = {
					...userState.user,
					setting: JSON.stringify(settings),
				};
				userDispatch({
					type: "login",
					payload: nextUser,
				});
				localStorage.setItem("user", JSON.stringify(nextUser));
			} else {
				showError(res.data.message || t("保存失败"));
				// Revert on error
				setCurrentLanguage(previousLang);
				i18n.changeLanguage(previousLang);
				localStorage.setItem("i18nextLng", previousLang);
			}
		} catch (error) {
			showError(t("保存失败，请重试"));
			// Revert on error
			setCurrentLanguage(previousLang);
			i18n.changeLanguage(previousLang);
			localStorage.setItem("i18nextLng", previousLang);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			style={{
				border: '1px solid var(--tcw-card-border)',
				borderRadius: '12px',
				background: 'var(--tcw-card-bg)',
				padding: '24px',
			}}
		>
			{/* Card Header */}
			<div className="flex items-center gap-3 mb-5">
				<div
					className="w-8 h-8 rounded-lg flex items-center justify-center"
					style={{
						border: '1px solid var(--tcw-card-border)',
						color: 'var(--tcw-title)',
					}}
				>
					<Languages size={16} />
				</div>
				<div>
					<div
						className="text-base font-semibold"
						style={{ color: 'var(--tcw-heading)' }}
					>
						{t("偏好设置")}
					</div>
					<div className="text-xs" style={{ color: 'var(--tcw-sub)' }}>
						{t("界面语言和其他个人偏好")}
					</div>
				</div>
			</div>

			{/* Language Setting */}
			<div
				className="rounded-xl p-4"
				style={{
					border: '1px solid var(--tcw-card-border)',
					background: 'var(--tcw-card-bg)',
				}}
			>
				<div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
					<div className="flex items-start w-full sm:w-auto">
						<div
							className="w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0"
							style={{
								border: '1px solid var(--tcw-card-border)',
								color: 'var(--tcw-title)',
							}}
						>
							<Languages size={18} />
						</div>
						<div>
							<div
								className="font-semibold text-sm mb-1"
								style={{ color: 'var(--tcw-heading)' }}
							>
								{t("语言偏好")}
							</div>
							<div
								className="text-xs"
								style={{ color: 'var(--tcw-body)' }}
							>
								{t("选择您的首选界面语言，设置将自动保存并同步到所有设备")}
							</div>
						</div>
					</div>
					<Select
						value={currentLanguage}
						onChange={handleLanguagePreferenceChange}
						style={{ width: 180 }}
						loading={loading}
						optionList={languageOptions.map((opt) => ({
							value: opt.value,
							label: opt.label,
						}))}
					/>
				</div>
			</div>

			{/* Hint */}
			<div className="mt-4 text-xs" style={{ color: 'var(--tcw-sub)' }}>
				<Typography.Text type="tertiary">
					{t(
						"提示：语言偏好会同步到您登录的所有设备，并影响API返回的错误消息语言。",
					)}
				</Typography.Text>
			</div>
		</div>
	);
};

export default PreferencesSettings;
