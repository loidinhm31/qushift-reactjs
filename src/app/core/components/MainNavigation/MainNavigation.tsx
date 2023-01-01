import {NavLink} from 'react-router-dom';

import classes from './MainNavigation.module.css';

function MainNavigation() {
    return (
        <nav>
            <ul>
                <li>
                    <NavLink
                        to="/"
                        className={({isActive}) => isActive ? classes.active : undefined}
                        end
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/messages"
                        className={({isActive}) => isActive ? classes.active : undefined}
                        end
                    >
                        Messages
                    </NavLink>
                </li>
            </ul>
        </nav>);
}

export default MainNavigation;
