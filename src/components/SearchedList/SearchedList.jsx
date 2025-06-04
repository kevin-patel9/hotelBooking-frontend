import { Link } from "react-router-dom";
import "./SearchedList.css";
import { useSelector } from "react-redux";

export const SearchedList = ({item}) => {

  const { options, dates } = useSelector((state) => state.booking);

  const totalDate = dates.map((data) => data?.endDate?.getDate() - data?.startDate?.getDate());

  return (
    <div className="serachList">
      {item ?
        (<div className="searchListItem">
        <div className="searchListImg">
          <img
            src={item?.photo[0]?.imgUrl || "https://images.oyoroomscdn.com/uploads/hotel_image/114912/large/70d2401be9f23e26.jpg"}
            alt="img"
            className="listImg"
          />
        </div>
        <div className="listDesc">
          <h2 className="listTitle">{item.name}</h2>
          <span className="listDistance">{item.distance}m from center</span>
          <span className="listTravel">Free Airport Taxi</span>
          <span className="listAbout">
            Studio Apartment With Air Condition
          </span>
          <span className="listFeatures">
            Entire studio, 1 bathroom
          </span>
          <span className="listCancel">Free Cancellation</span>
          <span className="listCancelSubtitles">
            You can cancel later, so lock in this great price!
          </span>
        </div>
        <div className="listDetails">
          {item.rating && <div className="listRating">
            <span>Excellent</span>
            <button>{item.rating}</button>
          </div>}
          <div className="listText">
            <span style={{ fontSize: 12 }}>Discounted Price:</span> 
            <span className="listPrice">
                ${((item.price * options?.room * totalDate) * 0.95).toFixed(2)}
              <span style={{ textDecorationLine: "line-through", color: "red", marginLeft: 2, fontSize: 14 }}>
                ${(item.price * options?.room * totalDate)}
              </span>
            </span>
            <span className="listTaxi">Includes Taxes Prices</span>
            <Link to= {`/hotels/${item.id}`}>
            <button className="listAvailButton">See avalibility</button>
            </Link>
          </div>
        </div>
      </div>
      ):<h1>No Item</h1> }
    </div>
  );
};
