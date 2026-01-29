import AppLogoIcon from './app-logo-icon';
import logo from '@/assets/logo.png';

export default function AppLogo() {
    return (
        <>

            <img src={logo} className="size-8  rounded-sm" />

            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Inventory Pro
                </span>
            </div>
        </>
    );
}
