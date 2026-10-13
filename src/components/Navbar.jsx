import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Logo, Button } from './UI.jsx';
import { useApp } from '../context/AppContext.jsx';
export default function Navbar() {
 const { user, logout } = useApp(); const [open, setOpen] = useState(false); const nav = useNavigate();
 const leave = () => { logout(); setOpen(false); nav('/'); };
 const links = user ? [['Home','/dashboard'],['Crops','/crops'],['History','/history'],['Disease Detection','/disease'],['Profile','/profile']] : [['Home','/'],['Crop Recommendation','/recommend'],['Disease Detection','/disease'],['About','/about']];
 return <header className="site-header"><div className="nav-wrap"><Logo/><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>{open ? <X/> : <Menu/>}</button><nav className={`main-nav ${open?'nav-open':''}`} aria-label="Main navigation">{links.map(([label,path])=><NavLink key={path} to={path} onClick={()=>setOpen(false)} end={path==='/'}>{label}</NavLink>)}<div className="nav-mobile-auth">{user ? <button onClick={leave}>Log out</button> : <><Link to="/login" onClick={()=>setOpen(false)}>Log in</Link><Button to="/signup" onClick={()=>setOpen(false)}>Get started</Button></>}</div></nav><div className="nav-auth">{user ? <button className="logout-link" onClick={leave}>Log out <ChevronDown size={15}/></button> : <><Link className="login-link" to="/login">Log in</Link><Button to="/signup">Get started</Button></>}</div></div></header>
}
