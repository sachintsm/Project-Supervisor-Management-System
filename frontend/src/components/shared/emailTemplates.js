export function userRagistrationEmail(email, firstName, lastName) {
    const mail = {
        to: email,
        subject: 'E-supervision registration successfull',
        content: `  <div style="background-color: #D5D5D5; width: 100%;">
                        <h1 style="color:#1A3A94; text-align:center; font-weight:bold;">E-supervision</h1>
                    </div>
                    <h3>Dear ${firstName} ${lastName},</h3>
                    <p>You have been registered for E-supervision successfully! You can login to  E-supervision
                    using following link <link>www.esupervsion.lk</link></p>
                `
    }
    return mail;
}

export function supervisorRequestEmail(email, groupNumber,supervisorFirstName,supervisorLastName) {
    const mail = {
        to: email,
        subject: 'E-supervision project request',
        content: `  <div style="background-color: #D5D5D5; width: 100%;">
                        <h1 style="color:#1A3A94; text-align:center; font-weight:bold;">E-supervision</h1>
                    </div>
                    <h3>Dear ${groupNumber},</h3>
                    <p>Your project request has been accepted by supervisor ${supervisorFirstName} ${supervisorLastName}.You can check it by using following link <link>http://localhost:3000/studenthome/viewproject/requestsupervisor</link></p>
                `
    }
    return mail;
}


