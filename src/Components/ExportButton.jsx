import React from 'react';
import apiUrl from '../../config';
import Button from '@mui/material/Button';

const ExportButton = () => {
    const handleExport = () => {
        fetch(`${apiUrl}/api/export/`)  // Adjust with your Django backend URL
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error('Failed to export data');
            })
            .then(blob => {
                // Create a link to download the file
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'records.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(error => console.error('Error:', error));
    };

    return <Button onClick={handleExport} variant='contained' sx={{backgroundColor:'#8C383E', padding: '50', height: '37px'}}>EXPORT</Button>;
};

export default ExportButton;
