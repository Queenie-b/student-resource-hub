import Header from './components/Header/Header'
import { Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home/Home'
import Resource from './components/pages/Resources/Resource'
import AddResources from './components/pages/AddResources/AddResources'
import { useState } from 'react'
import MyResources from './components/pages/MyResources/MyResources'
import SignUp from './components/pages/SignUp/SignUp';


const initialResources = [
    {
        id: 1,
        title: "3000 Solved Problems in Calculus",
        description: "",
        subject: "Mathematics",
        category: "Questions",
        format: "PDF",
        file: "/resources/3000-solved-problems-in-calculus.pdf",
        ownerId: "other-user"
    },
    {
        id: 2,
        title: "Advanced Calculus",
        description: "",
        subject: "Mathematics",
        category: "Textbook",
        format: "PDF",
        file: "/resources/advancedCalculus.pdf",
        ownerId: "other-user"
    },
    {
        id: 3,
        title: "Conceptual Physics",
        description: "",
        subject: "Physics",
        category: "Textbook",
        format: "PDF",
        file: "/resources/conceptualPhysics.pdf",
        ownerId: "other-user"
    },
    {
        id: 4,
        title: "PreCalculus 2e",
        description: "",
        subject: "Mathematics",
        category: "Textbook",
        format: "PDF",
        file: "/resources/precalculus2e.pdf",
        ownerId: "other-user"
    },
    {
        id: 5,
        title: "University Physics Volume 1",
        description: "",
        subject: "Physics",
        category: "Textbook",
        format: "PDF",
        file: "/resources/universityPhysicsVol1.pdf",
        ownerId: "other-user"
    },
    {
        id: 6,
        title: "Basic Integration-Integral of Cos(2x)",
        description: "",
        subject: "Mathematics",
        category: "Videos",
        format: "MP4",
        file: "https://www.youtube.com/watch?v=cCdj0uy0v80&list=PL0o_zxa4K1BXDMB9u4YU7CGq1PDNIXn7r",
        ownerId: "other-user"
    }
];

const App = () => {

  const [resources, setResources] =  useState(initialResources);
  const [savedResourceIds, setSavedResourceIds] = useState([]);

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  function handleSignUp(name, email, password){

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password.trim()){
      alert("Please filll in the fields.");
      return false;
    }

    const existingUser = users.find(
      user => user.email === cleanEmail
    );

    if (existingUser) {
      alert("An account with this email already exists.");
      return false;
    }

    const newUser = {
      id: Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: password
    };

    setUsers(prevUsers => [
      ...prevUsers, 
      newUser
    ]);

    setCurrentUser({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
    });

    alert(`Welcome, ${newUser.name}!`);
    return true;

  }

  function handleSignIn(email, password){
    const cleanEmail = email.trim().toLowerCase();

    const user = users.find(
        user =>
            user.email === cleanEmail &&
            user.password === password
    );

    if (!user) {
        alert("Incorrect email or password.");
        return false;
    }

    setCurrentUser({
        id: user.id,
        name: user.name,
        email: user.email
    });

    alert(`Welcome back, ${user.name}!`);
    return true;

  }

  function handleSignOut() {
    setCurrentUser(null);
    alert("You have been signed out.");
}

  function addResource(newResource) {
    setResources(prevResources => [
      ...prevResources,
      {
        ...newResource,
        id: Date.now(),
        ownerId: currentUser.id
      }
    ]);
  }

  function updateResource (id, updatedDetails){
    setResources(prevResources => 
      prevResources.map(resource => 
        resource.id === id 
          ? {...resource, ...updatedDetails }
          : resource
      )
    );
  }

  function deleteResource (id) {
    setResources(prevResources =>
      prevResources.filter(resource => resource.id !== id)
    );

    setSavedResourceIds(prevIds =>
      prevIds.filter(savedId => savedId !== id)
    );
  }

  function toggleSavedResource(id) {
        setSavedResourceIds(prevIds =>
            prevIds.includes(id)
                ? prevIds.filter(savedId => savedId !== id)
                : [...prevIds, id]
        );
    }

  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resource resources={resources} savedResourceIds={savedResourceIds} onToggleSave={toggleSavedResource}/>}/>
        <Route path='/add-resource' element={<AddResources onAddResource={addResource}/>}/>
        <Route path='/my-resources' element={
          <MyResources
                resources={resources}
                savedResourceIds={savedResourceIds}
                currentUser={currentUser}
                onToggleSave={toggleSavedResource}
                onUpdateResource={updateResource}
                onDeleteResource={deleteResource}
             />
           }
        />
        <Route
            path="/signup"
            element={<SignUp onSignUp={handleSignUp} />}
        />
      </Routes>
    </div>
  )
}

export default App


