'use client'
import Script from "next/script";
import { getUserEmail, getUserRole } from '@/stores/auth/auth';
import { useEffect, useState } from "react";
import {getPendingProperties, getUserProperties, deleteUserProperty, getAgentProperties, getFavoriteProperties } from "@/services/property/PropertyServices";
import { PropertyDashboardDTO } from "@/types/Property/PropertyDashboardDTO";
import AgentSelector from "../components/AgentSelector";
import { assignAgentToProperty } from "@/services/user/UserServices";
import { getUserInfo } from "@/services/user/UserServices"; 
import { UserInfoDTO } from "@/types/User/UserInfoDTO"; 
import { changePassword } from "@/services/user/UserServices";
import { useRouter } from "next/router";
import AuthService from '@/services/authentication/AuthServices';
import { MessageSection } from '@/pages/components/dashboard/message/MessageSection';
import AppointmentSection from '@/pages/components/dashboard/appointment/AppointmentSection';
import PropertyAppointmentSection from '@/pages/components/dashboard/appointment/PropertyAppointmentSection';
import PendingAppointmentSection from '@/pages/components/dashboard/appointment/PendingAppointmentSection';
import ProfileSection from '@/pages/components/dashboard/profile/ProfileSection';
import AccountSection from '@/pages/components/dashboard/account/AccountSection';
import PropertySection from '@/pages/components/dashboard/property/PropertySection';
import FavoriteSection from '@/pages/components/dashboard/favorite/FavoriteSection';
import PasswordSection from '@/pages/components/dashboard/password/PasswordSection';
import PendingPropertySection from '@/pages/components/dashboard/property/PendingPropertySection';


export default function Dashboard() {
  const [pendingProperties, setPendingProperties] = useState<PropertyDashboardDTO[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfoDTO | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();

  useEffect(() => {
    const role = getUserRole();
    const email = getUserEmail() ?? "";

    setUserRole(role);
    setUserEmail(email);

    const fetchUserInfo = async () => {
      if (email) {
        try {
          const info = await getUserInfo(email);
          setUserInfo(info);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };

    fetchUserInfo(); 

  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        if (userRole) {
          setIsLoggedIn(true);
          const response = await getPendingProperties();
          setPendingProperties(response);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [userRole]);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  const updateUserInfo = (newUserInfo: UserInfoDTO) => {
    setUserInfo(newUserInfo);
  }

  const handleLogout = () => {
    AuthService.logout();
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <div>Please log in to access this page</div>;
  }
console.log("userRole: " + userRole);
  return (
  
  <div>
      <section>
        
        <div
          className="w-full bg-[url('/img/bg/14.jpg')] bg-no-repeat bg-cover bg-center relative z-0 after:w-full after:h-full after:absolute after:top-0 after:left-0 after:bg-white after:bg-opacity-30 after:-z-1"
        >
          <div className="container py-110px">
            <h1
              className="text-2xl sm:text-3xl md:text-26px lg:text-3xl xl:text-4xl font-bold text-heading-color mb-15px"
            >
              <span
                className="leading-1.3 md:leading-1.3 lg:leading-1.3 xl:leading-1.3"
                >My Account</span
              >
            </h1>
          </div>
        </div>
      </section>

     
      <section>
        <div className="container pt-30 pb-90px lg:pb-30">
          <div className="tab account-tab grid grid-cols-1 lg:grid-cols-12 gap-x-30px gap-y-50px">
            <div className="lg:col-start-1 lg:col-span-4">
              <ul className="tab-links lg:mr-30px border border-b-0 border-border-color-1">
                <li className={`border-b border-border-color-1 ${activeTab === 'dashboard' ? 'active bg-secondary-color text-white' : ''}`}>
                  <button
                    onClick={() => handleTabChange('dashboard')}
                    className="flex justify-between items-center px-5 py-15px w-full text-sm lg:text-base hover:text-secondary-color transition-all duration-300 capitalize"
                  >
                    <span className="leading-1.8 lg:leading-1.8">Dashboard</span>
                    <i className="fas fa-home text-sm"></i>
                  </button>
                </li>
                <li className={`border-b border-border-color-1 ${activeTab === 'profiles' ? 'active bg-secondary-color text-white' : ''}`}>
                  <button
                    onClick={() => handleTabChange('profiles')}
                    className="flex justify-between items-center px-5 py-15px w-full text-sm lg:text-base hover:text-secondary-color transition-all duration-300 capitalize"
                  >
                    <span className="leading-1.8 lg:leading-1.8">Profiles</span>
                    <i className="fas fa-user text-sm"></i>
                  </button>
                </li>
                <li className={`border-b border-border-color-1 ${activeTab === 'account' ? 'active bg-secondary-color text-white' : ''}`}>
                  <button
                    onClick={() => handleTabChange('account')}
                    className="flex justify-between items-center px-5 py-15px w-full text-sm lg:text-base hover:text-secondary-color transition-all duration-300 capitalize"
                  >
                    <span className="leading-1.8 lg:leading-1.8">Account Details</span>
                    <i className="fas fa-map-marker-alt text-sm"></i>
                  </button>
                </li>
                <li className={`border-b border-border-color-1 ${activeTab === 'properties' ? 'active bg-secondary-color text-white' : ''}`}>
                  <button
                    onClick={() => handleTabChange('properties')}
                    className="flex justify-between items-center px-5 py-15px w-full text-sm lg:text-base hover:text-secondary-color transition-all duration-300 capitalize"
                  >
                    <span className="leading-1.8 lg:leading-1.8">My Properties</span>
                    <i className="fa-solid fa-list text-sm"></i>
                  </button>
                </li>
                {userRole?.toLowerCase() === 'agent' && (
                  <li className={`border-b border-border-color-1 ${activeTab === 'pending-approvals' ? 'active bg-secondary-color text-white' : ''}`}>
                    <button
                      onClick={() => handleTabChange('pending-approvals')}
                      className="flex justify-between items-center px-5 py-15px w-full text-sm lg:text-base hover:text-secondary-color transition-all duration-300 capitalize"
                    >
                      <span className="leading-1.8 lg:leading-1.8">Pending Approvals</span>
                      <i className="fas fa-clock text-sm"></i>
                    </button>
                  </li>
                )}
                <li className={`border-b border-border-color-1 ${activeTab === 'favorites' ? 'active bg-secondary-color text-white' : ''}`}>
                  <button
                    onClick={() => handleTabChange('favorites')}
                    className="flex justify-between items-center px-5 py-15px w-full text-sm lg:text-base hover:text-secondary-color transition-all duration-300 capitalize"
                  >
                    <span className="leading-1.8 lg:leading-1.8">Favorited Properties</span>
                    <i className="fa-solid fa-heart text-sm"></i>
                  </button>
                </li>
                <li className={`border-b border-border-color-1 ${activeTab === 'password' ? 'active bg-secondary-color text-white' : ''}`}>
                  <button
                    onClick={() => handleTabChange('password')}
                    className="flex justify-between items-center px-5 py-15px w-full text-sm lg:text-base hover:text-secondary-color transition-all duration-300 capitalize"
                  >
                    <span className="leading-1.8 lg:leading-1.8">Change Password</span>
                    <i className="fa-solid fa-lock text-sm"></i>
                  </button>
                </li>
                <li className={`border-b border-border-color-1 ${activeTab === 'my-appointments' ? 'active bg-secondary-color text-white' : ''}`}>
                  <button
                    onClick={() => handleTabChange('my-appointments')}
                    className="flex justify-between items-center px-5 py-15px w-full text-sm lg:text-base hover:text-secondary-color transition-all duration-300 capitalize"
                  >
                    <span className="leading-1.8 lg:leading-1.8">My Appointments</span>
                    <i className="fas fa-calendar text-sm"></i>
                  </button>
                </li>
                {userRole?.toLowerCase() === 'user' && (
                    <li className={`border-b border-border-color-1 ${activeTab === 'pending-appointments' ? 'active bg-secondary-color text-white' : ''}`}>
                        <button
                            onClick={() => handleTabChange('pending-appointments')}
                            className="flex justify-between items-center px-5 py-15px w-full text-sm lg:text-base hover:text-secondary-color transition-all duration-300 capitalize"
                        >
                            <span className="leading-1.8 lg:leading-1.8">Pending Appointments</span>
                            <i className="fas fa-clock text-sm"></i>
                        </button>
                    </li>
                )}
                <li className={`border-b border-border-color-1 ${activeTab === 'property-appointments' ? 'active bg-secondary-color text-white' : ''}`}>
                  <button
                    onClick={() => handleTabChange('property-appointments')}
                    className="flex justify-between items-center px-5 py-15px w-full text-sm lg:text-base hover:text-secondary-color transition-all duration-300 capitalize"
                  >
                    <span className="leading-1.8 lg:leading-1.8">Property Appointments</span>
                    <i className="fas fa-building text-sm"></i>
                  </button>
                </li>
                <li className={`border-b border-border-color-1 ${activeTab === 'messages' ? 'active bg-secondary-color text-white' : ''}`}>
                  <button
                    onClick={() => handleTabChange('messages')}
                    className="flex justify-between items-center px-5 py-15px w-full text-sm lg:text-base hover:text-secondary-color transition-all duration-300 capitalize"
                  >
                    <span className="leading-1.8 lg:leading-1.8">Messages</span>
                    <i className="fa-solid fa-message text-sm"></i>
                  </button>
                </li>
                <li className="border-b border-border-color-1">
                  <button
                    onClick={handleLogout}
                    className="flex justify-between items-center px-5 py-15px w-full text-sm lg:text-base hover:text-secondary-color transition-all duration-300 capitalize"
                  >
                    <span className="leading-1.8 lg:leading-1.8">Logout</span>
                    <i className="fas fa-sign-out-alt text-sm"></i>
                  </button>
                </li>
                
              </ul>
            </div>
           
            <div className="lg:col-start-5 lg:col-span-8">
              {activeTab === 'dashboard' && (
                <div className="transition-all duration-300">
                <div className="p-6 bg-white rounded-lg shadow-lg mb-6">
                    {isLoggedIn && (
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-secondary-color flex items-center justify-center">
                                <span className="text-xl text-white font-bold">
                                    {userEmail?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-heading-color">
                                    Welcome back, <span className="text-secondary-color">{userInfo?.name}</span>
                                </h1>
                            </div>
                        </div>
                    )}
                </div>
        
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <i className="fas fa-home text-secondary-color"></i>
                            Quick Actions
                        </h2>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-gray-600 hover:text-secondary-color transition-colors">
                                <i className="fas fa-plus"></i>
                                <a href="/properties/add">Add New Property</a>
                            </li>
                            <li className="flex items-center gap-2 text-gray-600 hover:text-secondary-color transition-colors">
                                <i className="fas fa-heart"></i>
                                <a href="#" onClick={() => handleTabChange('favorites')}>View Favorites</a>
                            </li>
                            <li className="flex items-center gap-2 text-gray-600 hover:text-secondary-color transition-colors">
                                <i className="fas fa-calendar"></i>
                                <a href="#" onClick={() => handleTabChange('my-appointments')}>Manage Appointments</a>
                            </li>
                        </ul>
                    </div>
        
                    <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-secondary-color"></i>
                            Account Overview
                        </h2>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-gray-600">
                                <i className="fas fa-user"></i>
                                Role: <span className="font-semibold">{userRole}</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-600">
                                <i className="fas fa-envelope"></i>
                                Email: <span className="font-semibold">{userEmail}</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-600">
                                <i className="fas fa-shield-alt"></i>
                                <a href="#" onClick={() => handleTabChange('password')} className="hover:text-secondary-color transition-colors">
                                    Update Password
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
              )}

              {activeTab === 'profiles' && <ProfileSection />}
              {activeTab === 'account' && <AccountSection  updateUserInfo={updateUserInfo}/>}
              {activeTab === 'properties' && <PropertySection />}
              {activeTab === 'pending-approvals' && (
                <PendingPropertySection pendingProperties={pendingProperties} />
              )}
              {activeTab === 'favorites' && <FavoriteSection />}
              {activeTab === 'password' && <PasswordSection />}
              {activeTab === 'my-appointments' && <AppointmentSection />}
              {activeTab === 'property-appointments' && <PropertyAppointmentSection />}
              {activeTab === 'pending-appointments' && <PendingAppointmentSection />}
              {activeTab === 'messages' && (
                <MessageSection userEmail={userEmail} />
              )}
              
            </div>
          </div>
        </div>
        

      </section>


   
      <button
      className="scroll-up w-30px h-30px lg:w-10 lg:h-10 lg:text-xl bg-section-bg-1 text-heading-color hover:bg-secondary-color hover:text-white rotate-[45deg] shadow-box-shadow-3 fixed bottom-[50px] lg:bottom-[70px] left-[3%] flex justify-center items-center z-xl"
    >
      <i className="fa fa-angle-up leading-1 -rotate-[45deg] inline-block"></i>
    </button>

   
      </div>
    

  

)};