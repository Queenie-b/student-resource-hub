import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'
import { Plus, FilePlus, NotebookPen, MessageCircle } from 'lucide-react'


const Header = () => {

    const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="Header">
      <img src="/SRLogo.png" alt="Student Resource Hub" className="logo" />
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
                    <button type="button">
                        <FilePlus className='add-resource'/>
                        <span>Add Resources</span>
                    </button>

                    <button type='button'>
                        <NotebookPen className='add-note'/>
                        <span>Add Note</span>
                    </button>

                    <button type='button'>
                        <MessageCircle className='join-discussion'/>
                        <span>Join Discussion</span>
                    </button>
                </div>
            )}
        </div>
        <button type="button" className="signIn">Sign In</button>
      </div>
    </header>
  )
}

export default Header
