import React, { useContext, useEffect,  } from "react";
import WorkTemp from "../components/detais";
import WorkoutForm from "../components/workoutform";
import { WorkoutContext } from "../context/context";
import { AuthContext } from "../context/authcontext";



export default function Home(){
    
    const {state,dispatch} = useContext(WorkoutContext)
    const {user} = useContext(AuthContext)
    
     useEffect(()=>{
          const fetchworkout = async()=>{
             const response = await fetch('http://localhost:4000/workout/',
             {
                headers : {
                    'authorization' : `Bearer ${user.token}`
                }
             })

             const data = await response.json()

             if(response.ok){
                dispatch({type:'SET_WORKOUTS',payload:data})
             }
          }
          if(user)
          {
            fetchworkout()
          }
     },[dispatch,user])


    return(
        <div className="home">
            <div className="workouts">
                {state.workout.map((workout)=>{
                   return <WorkTemp key={workout._id} data={workout} />
                   
                })}
            </div>
            <WorkoutForm />
        </div>
    )
}