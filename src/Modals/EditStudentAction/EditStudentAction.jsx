import React, { useState } from "react";
import './EditStudentAction.css';
import axios from 'axios';
import apiUrl from '../../config';
import { useSnackbar } from 'notistack';


export default function EditStudentModal({ isOpen, onClose, studentID, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [currentPasswordIsDefault, setCurrentPasswordIsDefault] = useState(false);
    const { enqueueSnackbar } = useSnackbar();


    const logActivity = async (action, username) => {
        const logData = {
            username: username,
            action: action,
            timestamp: new Date().toISOString(),
        };
    
        try {
            console.log("Logging activity with data: ", logData);  // For debugging
            // Ensure this is hitting the correct backend endpoint
            await axios.post(`${apiUrl}/api/activity-logs/`, logData);
            console.log("Activity logged successfully");
        } catch (error) {
            console.error("Error logging activity:", error.response?.data || error.message);
        }
    };
    


  const handleResetPassword = async () => {
    try {
        const response = await axios.post(`${apiUrl}/api/students/${studentID}/reset-password/`);
        enqueueSnackbar('Password reset successful!', { variant: 'success' });
        

        await logActivity(`Reset password for student ${studentID}`, username);


        onClose(); 
    } catch (error) {
        if (error.response && error.response.data.message === 'Current password is already the default.') {
            enqueueSnackbar('The password is already set to default', { variant: 'error' });
            onClose();
        } else {
            enqueueSnackbar('Error resetting password', { variant: 'error' });
        }
        console.error("Error resetting password:", error.response ? error.response.data : error.message);
    }
};



    return (
        isOpen && (
            <div className="resetpass_modal-overlay">
                <div className="resetpass_modal-content">
                    <div className="resetpass_modal-header">
                        <h2 className="resetpass_header-title">
                           Reset Password
                        </h2>
                    </div>
                    <div className="resetpass_modal-body">
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <p>
                                Are you sure you want to Reset student <strong>{studentID}</strong>'s password?
                                
                            </p>
                        )}
                    </div>
                    <div className="resetpass_modal-footer">
                    <button className="resetpass_cancel-button" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </button>
                        <button className="resetpass_confirm-button" onClick={handleResetPassword} disabled={isLoading}>
                            Reset
                        </button>
                       
                    </div>
                </div>

            </div>
        )
    );
}
