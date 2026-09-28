import {useEffect,useState} from 'react';
import {supabase} from "../../supabaseClient";
import "./BusTracking.css";


export default function BusTracking(){
    const[buses,setBuses] = useState([]);

    const fetchBuses=async()=>{
        const {data,error}= await supabase
        .from("buses").select("*")
        .order("updated_at",{ascending:false});
    console.log("STATUS:",status);
    console.log("BUS DATA:", data);
    console.log("ERROR:", error);
    if(!error) setBuses(data||[]);
    };


    useEffect(()=>{
        fetchBuses();
        //auto refresh every 5 secs
        const interval=setInterval(fetchBuses,5000);
        return()=> clearInterval(interval);

    },[]);

    return(
        <div className="bus-page">
            <h2 className="page-title">Campus Bus Tracking</h2>

            {buses.length===0 ?(
                <p>No buses available</p>
            ):(
                <div className="bus-list">
                    {buses.map((bus)=>(
                        <div key={bus.id}
                        className={`bus-card ${bus.status.toLowerCase().replace(" ","")}`}>
                        <div className="bus-top">
                            <h3>{bus.bus_no}</h3>
                            <span className={`status ${bus.status.toLowerCase().replace(" ","")}`}>
                                {bus.status}
                            </span>
                        </div>
                        <div className="bus-bottom">
                            <small>
                                Updated:{" "}
                                {new Date(bus.updated_at).toLocaleTimeString([],{
                                    day:"2-digit",month:"short",
                                    hour:"2-digit",minute:"2-digit"
                                })}
                            </small>
                        </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}