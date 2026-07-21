import useAuth from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import useMapData from "../../hooks/useMapData.js";
import { useState } from "react";

export default function Profile() {
    const { user, logoutUser, updateUserSettings } = useAuth()
    const { ICONS, userIcon, updateUserIcon } = useMapData()
    const navigate = useNavigate()
    const [settingsError, setSettingsError] = useState('')
    const [isSavingSettings, setIsSavingSettings] = useState(false)
    const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ')
    const profileRows = [
        ['Username', user?.username],
        ['Full name', fullName],
        ['Email', user?.email],
    ]

    async function handleLogout() {
        await logoutUser()
        navigate('/login')
    }

    async function handleIncomingMessagesChange(event) {
        await saveSettings({
            allow_incoming_messages: event.target.checked,
        })
    }

    async function handleHideMeChange(event) {
        await saveSettings({
            hide_me: event.target.checked,
        })
    }

    async function saveSettings(payload) {
        setSettingsError('')

        try {
            setIsSavingSettings(true)
            await updateUserSettings(payload)
        } catch (error) {
            setSettingsError(error.message || 'Unable to save settings.')
        } finally {
            setIsSavingSettings(false)
        }
    }

    return (
        <div className="center">
            <section className="profile-panel">
                <div className="profile-header">
                    <div className="profile-page-avatar">
                        {(fullName || user?.username || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1>{fullName || user?.username || 'Profile'}</h1>
                        <p>{user?.email || 'No email available'}</p>
                    </div>
                </div>

                <dl className="profile-details">
                    {profileRows.map(([label, value]) => (
                        <div className="profile-detail" key={label}>
                            <dt>{label}</dt>
                            <dd>{value || 'Not provided'}</dd>
                        </div>
                    ))}
                </dl>
                <section className="settings-section">
                    <div>
                        <h3>Messages</h3>
                        <p>Allow nearby users to start conversations with you.</p>
                    </div>
                    <label className="toggle-row">
                        <span>Incoming messages</span>
                        <input
                            type="checkbox"
                            checked={Boolean(user?.allow_incoming_messages)}
                            disabled={isSavingSettings}
                            onChange={handleIncomingMessagesChange}
                        />
                    </label>
                    <label className="toggle-row">
                        <span>Hide me on map</span>
                        <input
                            type="checkbox"
                            checked={Boolean(user?.hide_me)}
                            disabled={isSavingSettings}
                            onChange={handleHideMeChange}
                        />
                    </label>
                    {settingsError ? <p className="form-error">{settingsError}</p> : null}
                </section>
                <div className="icon-box">
                    {Object.keys(ICONS).map((name) => (
                        <img key={name}
                            onClick={() => updateUserIcon(name)} src={ICONS[name]} alt={name} className={`big-icon ${userIcon === name? 'active':''}`} />
                    )
                    )}
                </div>
                <button className="logout-button" onClick={handleLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon ">
                        <path  strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                    </svg>
                    Log out
                </button>
            </section>
        </div>
    )
}
