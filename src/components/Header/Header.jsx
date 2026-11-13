import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Header.css'
import { Plus, FilePlus, NotebookPen, MessageCircle, BookOpen } from 'lucide-react'


const Header = () => {

    const [isOpen, setIsOpen] = useState(false)

    const navigate = useNavigate();

  return (
    <header className="Header">
      <img src="/SRLogo2.png" alt="Student Resource Hub" className="logo" />
      <nav className="header-contents" aria-label="Main navigation">
        <ul className="menu">
          <li>
            <NavLink to="/" end>Home</NavLink>
          </li>
          <li>
            <NavLink to="/resources">Resources</NavLink>
          </li>
        </ul>
      </nav>
      <div className="dropdown">
        <div className="drop-down">
            <button type="button" className="add-menu-trigger" aria-label="Open add menu" aria-expanded={isOpen} onClick={() => setIsOpen((prev) => !prev)}>
                <Plus className="add-menu-icon" aria-hidden="true" />
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    <button type="button" onClick={() => navigate('/add-resource')}>
                          <FilePlus className='add-resource'/>
                          <span>Add Resources</span>                        
                    </button>

                    <button type="button" onClick={() => { navigate('/add-note'); setIsOpen(false); }}>
                        <NotebookPen className='add-note'/>
                        <span>Add Note</span>
                    </button>

                    <button type='button' onClick={() => navigate('/my-resources')}>
                        <BookOpen className='my-resources'/>
                        <span>My Resources</span>
                    </button>
                </div>
            )}
        </div>
        <button type="button" className="signIn" onClick={() => navigate('/signin')}>Sign In</button>
      </div>
    </header>
  )
}

export default Header
