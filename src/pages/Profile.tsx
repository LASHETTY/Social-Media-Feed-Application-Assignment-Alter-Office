import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { auth, storage, db } from '../config/firebase';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { User } from '../types';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useStore(state => state.currentUser);
  const setCurrentUser = useStore(state => state.setCurrentUser);
  
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState('');
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchUserBio = async () => {
      if (!currentUser) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setBio(userDoc.data().userBio || '');
        }
      } catch (error) {
        console.error('Error fetching user bio:', error);
      }
    };
    fetchUserBio();
  }, [currentUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfilePic(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !auth.currentUser) return;

    try {
      setLoading(true);
      let photoURL = currentUser.photoURL;

      if (newProfilePic) {
        const storageRef = ref(storage, `profiles/${currentUser.uid}`);
        const snapshot = await uploadBytes(storageRef, newProfilePic);
        photoURL = await getDownloadURL(snapshot.ref);
      }

      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL,
      });

      // Update local state
      setCurrentUser({
        ...currentUser,
        displayName: name,
        photoURL,
      });

      // Update Firestore user document
      const userRef = doc(db, 'users', currentUser.uid);
      const userData = {
        displayName: name,
        photoURL,
        userBio: bio,
      };
      await updateDoc(userRef, userData);

      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

            <div className="flex items-center space-x-4">
              <img
                src={newProfilePic ? URL.createObjectURL(newProfilePic) : currentUser.photoURL || ''}
                alt={currentUser.displayName || ''}
                className="w-20 h-20 rounded-full object-cover"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
              />
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            <button
              onClick={() => setEditing(true)}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Logout
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={currentUser.photoURL || ''}
                alt={currentUser.displayName || ''}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold">{currentUser.displayName || 'Anonymous'}</h2>
                <p className="text-darkGray">{currentUser.email}</p>
              </div>
            </div>

            {bio && (
              <p className="text-darkGray">{bio}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
