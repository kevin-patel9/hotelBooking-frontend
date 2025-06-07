import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import { useFetch } from "../../hooks/useFetch";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, refetchData } = useFetch();

  useEffect(() => {
    refetchData(`/hotel/room/${hotelId}`)
  },[]);

  const [roomData, setRoomData] = useState([]);
  const [currentRoomId, setCurrentRoomId] = useState("");

  useEffect(() => {
    const updatedData = data.map((val) => {
      const updatedRoomNumbers = [];

      val?.roomNumbers?.forEach((room) => {
        const existingRoom = updatedRoomNumbers.find((item) => item.number === room.number);

        if (existingRoom) {
          existingRoom.bookedRooms.push(room.bookedDate);
        } else {
          updatedRoomNumbers.push({
            id: room.id,
            number: room.number,
            bookedRooms: room.bookedDates,
          });
        }
      });

      return { ...val, roomNumbers: updatedRoomNumbers.sort((a,b) => a.number - b.number)};
    });

    setRoomData(updatedData);

  },[data])

  const booking = useSelector((state) => state.booking);

  const getRangeDates = (startDate, endDate) => {
    const start = new Date(startDate.getTime());
    const end = new Date(endDate.getTime());
  
    const dates = [];
  
    while (start <= end) {
      // Convert to YYYY-MM-DD format
      const formattedDate = new Date(start).toISOString().split('T')[0];
      dates.push(formattedDate);
  
      start.setDate(start.getDate() + 1);
    }
  
    return dates;
  };  

  const alldates = getRangeDates(
    booking?.dates[0]?.startDate || new Date(),
    booking?.dates[0]?.endDate || new Date()
  );

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber?.bookedRooms?.some((date) =>
      alldates.includes(date)
    );

    return !isFound;
  };

  const handleSelect = (e, roomId) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setCurrentRoomId(roomId);
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const navigate = useNavigate();

  const handleClick = async () => {
      const res = await axiosInstance.post(`/room/availability`, {
        roomId: currentRoomId,
        roomNumber: selectedRooms,
        startDate: booking?.dates[0]?.startDate,
        endDate: booking?.dates[0]?.endDate
      });

      setOpen(false)

      if (res.data.message){
        navigate("/")
      }
  };

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {roomData?.map((item) => (
          <div className="rItem" key={item.id}>
            <div className="rItemInfo">
              <div className="rTitle">{item?.title}</div>
              <div className="rDesc">{item?.desc}</div>
              <div className="rMax">
                Max people: <b>{item?.maxPeople}</b>
              </div>
              <div className="rPrice"><b>${item.price}</b></div>
            </div>
            <div className="rSelectRooms">
              { item?.roomNumbers?.map((roomNumber, i) => {
                return (
                <div key={i}>
                    <div className="rooms">
                        <label>{roomNumber.number}</label>
                        <input
                            type="checkbox"
                            value={roomNumber.number}
                            onChange={(e) => handleSelect(e, item.id)}
                            disabled={!isAvailable(roomNumber)}
                        />
                    </div>
                </div>
                )
              }) }
            </div>
          </div>
        ))}
        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;
