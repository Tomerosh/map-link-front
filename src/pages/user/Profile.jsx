import useAuth from "../../context/useAuth.js";
import { useNavigate } from "react-router-dom";
import useMapData from "../../context/useMapData.js";

export default function Profile() {
    const { user, logoutUser } = useAuth()
    const { ICONS, userIcon, updateUserIcon } = useMapData()
    // const iconClass = () => `big-icon ${userIcon === }`
    const navigate = useNavigate()
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
