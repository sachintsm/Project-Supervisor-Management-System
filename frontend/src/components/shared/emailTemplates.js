export function userRagistrationEmail(email, firstName, lastName) {
  const mail = {
    to: email,
    subject: "E-supervision registration successfull",
    content: `  <div style="background-color: #D5D5D5; width: 100%;">
                        <h1 style="color:#1A3A94; text-align:center; font-weight:bold;">E-supervision</h1>
                    </div>
                    <h3>Dear ${firstName} ${lastName},</h3>
                    <p>You have been registered for E-supervision successfully! You can login to  E-supervision
                    using following link <link>www.esupervsion.lk</link></p>
                `,
  };
  return mail;
}

export function supervisorRequestEmail(
  email,
  groupNumber,
  supervisorFirstName,
  supervisorLastName
) {
  const mail = {
    to: email,
    subject: "E-supervision project request",
    content: `  <p>by ${supervisorFirstName} ${supervisorLastName}</p>
                    <div style="background-color: #D5D5D5; width: 100%;">
                        <h1 style="color:#1A3A94; text-align:center; font-weight:bold;">E-supervision</h1>
                    </div>
                    <h3>Dear group ${groupNumber},</h3>
                    <p>Your project request has been accepted.You can check it by using following link <link>http://localhost:3000/studenthome/viewproject/requestsupervisor</link></p>
                `,
  };
  return mail;
}

export function meetingRequestConfirmEmail(email, groupNumber, date, time) {
  const mail = {
    to: email,
    subject: "E-supervision Supervisor Meeting Confirmaration",
    content: `  <div style="background-color: #D5D5D5; width: 100%;">
                    <h1 style="color:#1A3A94; text-align:center; font-weight:bold;">E-supervision</h1>
                    </div>
                    <h3>Dear group ${groupNumber},</h3>
                    <p>Your requested meeting has been accepted.You can have the meeting on ${date} at ${time}.</p>
                `,
  };
  return mail;
}

export function meetingRequestEmail(
  email,
  groupNumber,
  purpose,
  supervisorFname,
  supervisorLname
) {
  const mail = {
    to: email,
    subject: "E-supervision Supervisor Meeting Request",
    content: `  <div style="background-color: #D5D5D5; width: 100%;">
                    <h1 style="color:#1A3A94; text-align:center; font-weight:bold;">E-supervision</h1>
                    </div>
                    <h3>Dear ${supervisorFname} ${supervisorLname},</h3>
                    <p>You have a new meeting request from group ${groupNumber} .</p>
                    <p>Purpose : ${purpose}  .</p>
                    <p>You can check it by using following link <link>http://localhost:3000/supervisorhome/viewMeetings</link></p>
                `,
  };
  return mail;
}

export function passwordResetEmail(email, firstName, lastName) {
  const mail = {
    to: email,
    subject: "E-supervision User Password Reset",
    content: `  <div style="background-color: #D5D5D5; width: 100%;">
                    <h1 style="color:#1A3A94; text-align:center; font-weight:bold;">E-supervision</h1>
                    </div>
                    <h3>Dear ${firstName} ${lastName},</h3>
                    <p>Your Password has been updated to your NIC number .</p>
                    <p>You can login to  E-supervision using following link <link>www.esupervsion.lk</link> and reset your password.</p>
                `,
  };
  return mail;
}
