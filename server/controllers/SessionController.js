import User from '../models/User';
import Session from '../models/Session';

class SessionController{

  static view_sessions(req,res){
    const {auth_user}=req;
    const {type:user_type,id:auth_userId,email:auth_email}=auth_user;
    let all_sessions=[];
    //check if the auth user is mentor or mentee

    
    if(user_type==='mentor'){//mentor
      
      const fetch_sessions=Session.findForMentor(auth_userId);

      fetch_sessions.forEach(session => {
        const mentee=User.find(session.menteeId);
        const menteeEmail=mentee.email;
        const sessionWithMenteeEmail={...session,menteeEmail};

        //loading session with mentee
        all_sessions.push({
          ...sessionWithMenteeEmail,mentee
        });
        delete session.menteeEmail;

      });
     
     
    }else if(user_type==='normal'){//mentee
      
      const fetch_sessions=Session.findForMentee(auth_userId);

      fetch_sessions.forEach(session => {
        const mentor=User.find(session.mentorId);
        const menteeEmail=auth_email;
        const sessionWithMenteeEmail={...session,menteeEmail};

        //loading session with mentor
        all_sessions.push({
          ...sessionWithMenteeEmail,mentor
        });
        delete session.menteeEmail;
      });
    }

    return res.status(200).json({
      status:200,
      data:all_sessions,
     
    });


  }
 
  static create(req,res){
    let {body}=req;
    const {id,email}=req.auth_user;
    body.menteeId=id;
    body.mentorId=parseInt(body.mentorId);
    body.status='pending';
   
    const fetch_mentor=User.findMentor(body.mentorId);
    if(fetch_mentor){
      let session=Session.create(body);
      session.menteeEmail=email;
  
      res.status(200).json({
        status:200,
        data:session,
      });
    }
    else{
      res.status(400).json({
        status:400,
        error:'Mentor not found',
      });
    }
    
  }


  static acceptSession(req,res){
    const {sessionId}=req.params;
    const {auth_user}=req;
    const fetch_session=Session.find(sessionId);
    let error_msg='Session not found,create sessions';

    if(fetch_session){
      //check if the mentor is concerned for this sesion
     
      if(auth_user.id===fetch_session.mentorId){
        
        if(fetch_session.status==='pending'){
          const update_session=Session.update(sessionId,{status:'accepted'});
          return res.status(200).json({
            status:200,
            data:update_session
          });
        }

        error_msg=`You can not do this operation : session status is ${fetch_session.status}`;
       
      }
      else{
        error_msg='Session does not concern you';
       
      }
      
    }

    return res.status(400).json({
      status:400,
      error:error_msg,
    });
    
  }

  static rejectSession(req,res){
    const {sessionId}=req.params;
    const {auth_user}=req;
    const fetch_session=Session.find(sessionId);
    let error_msg='Session not found,create sessions';

    if(fetch_session){
      //check if the mentor is concerned for this sesion
      if(auth_user.id===fetch_session.mentorId){
        
        if(fetch_session.status==='pending'){
          const update_session=Session.update(sessionId,{status:'rejected'});
          return res.status(200).json({
            status:200,
            data:update_session
          });
        }

        error_msg=`You can not do this operation : session status is ${fetch_session.status}`;
       
      }
      else{
        error_msg='Session does not concern you';
       
      }
      
    }

    return res.status(400).json({
      status:400,
      error:error_msg,
    });
    
  }


}

export default SessionController;