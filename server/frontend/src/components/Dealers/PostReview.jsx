import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0, curr_url.indexOf("postreview"));
  let params = useParams();
  let id = params.id;
  let dealer_url = root_url + `djangoapp/dealer/${id}`;
  let review_url = root_url + `djangoapp/add_review`;
  let carmodels_url = root_url + `djangoapp/get_cars`;

  const pageStyles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #ecfeff 0%, #ffffff 42%, #ffffff 100%)",
      paddingBottom: "40px"
    },
    wrapper: {
      maxWidth: "960px",
      margin: "0 auto",
      padding: "28px 16px 60px"
    },
    hero: {
      background:
        "radial-gradient(1200px 300px at 10% 10%, rgba(34,193,195,.35), transparent 60%), radial-gradient(900px 240px at 90% 30%, rgba(14,165,168,.25), transparent 55%), linear-gradient(180deg, #ffffff 0%, #f0fdff 100%)",
      border: "1px solid rgba(15, 23, 42, 0.12)",
      borderRadius: "18px",
      padding: "28px 24px",
      boxShadow: "0 10px 35px rgba(15, 23, 42, 0.08)",
      marginBottom: "22px"
    },
    heroTitle: {
      fontWeight: 900,
      letterSpacing: "-0.3px",
      margin: "0 0 8px 0",
      color: "#0f172a"
    },
    heroText: {
      color: "#475569",
      lineHeight: 1.65,
      margin: 0
    },
    pillRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginTop: "16px"
    },
    pill: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      borderRadius: "999px",
      background: "rgba(14,165,168,.10)",
      border: "1px solid rgba(14,165,168,.20)",
      color: "#064e51",
      fontWeight: 700,
      fontSize: ".92rem"
    },
    dot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: "#0ea5a8",
      boxShadow: "0 0 0 4px rgba(14,165,168,.15)"
    },
    sectionTitle: {
      margin: "6px 4px 10px",
      fontWeight: 800,
      letterSpacing: "-0.2px",
      color: "#0f172a"
    },
    sectionSubtitle: {
      margin: "0 4px 18px",
      color: "#475569"
    },
    card: {
      background: "#ffffff",
      border: "1px solid rgba(15, 23, 42, 0.12)",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(15,23,42,.06)",
      overflow: "hidden"
    },
    cardTop: {
      padding: "18px 20px",
      background: "linear-gradient(180deg, rgba(14,165,168,.08), rgba(14,165,168,0))",
      borderBottom: "1px solid rgba(15, 23, 42, 0.08)"
    },
    dealerName: {
      margin: 0,
      fontSize: "1.25rem",
      fontWeight: 900,
      color: "#0f172a"
    },
    dealerMeta: {
      margin: "6px 0 0",
      color: "#0b7f82",
      fontWeight: 700
    },
    form: {
      padding: "20px"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "16px",
      marginBottom: "16px"
    },
    field: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    label: {
      fontWeight: 800,
      color: "#0f172a",
      fontSize: ".95rem"
    },
    input: {
      width: "100%",
      border: "1px solid rgba(15,23,42,.12)",
      borderRadius: "12px",
      padding: "12px 14px",
      outline: "none",
      background: "#fff",
      color: "#0f172a",
      fontSize: ".96rem",
      boxSizing: "border-box"
    },
    textarea: {
      width: "100%",
      border: "1px solid rgba(15,23,42,.12)",
      borderRadius: "12px",
      padding: "14px",
      outline: "none",
      background: "#fff",
      color: "#0f172a",
      fontSize: ".96rem",
      lineHeight: 1.55,
      boxSizing: "border-box",
      resize: "vertical",
      minHeight: "180px"
    },
    helpText: {
      fontSize: ".88rem",
      color: "#64748b",
      marginTop: "6px"
    },
    actionRow: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      marginTop: "18px"
    },
    submitBtn: {
      background: "#0ea5a8",
      border: "none",
      borderRadius: "12px",
      padding: "12px 18px",
      fontWeight: 800,
      color: "#ffffff",
      cursor: "pointer",
      boxShadow: "0 10px 20px rgba(14,165,168,.18)"
    },
    secondaryBtn: {
      background: "rgba(255,255,255,.7)",
      border: "1px solid rgba(15,23,42,.12)",
      borderRadius: "12px",
      padding: "12px 18px",
      fontWeight: 800,
      color: "#0f172a",
      cursor: "pointer"
    },
    footerNote: {
      marginTop: "20px",
      padding: "16px 18px",
      borderRadius: "14px",
      border: "1px dashed rgba(15,23,42,.18)",
      background: "rgba(248,250,252,.7)",
      color: "#475569"
    }
  };

  const postreview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");

    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }

    if (!model || review === "" || date === "" || year === "" || model === "") {
      alert("All details are mandatory");
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split[1];

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": id,
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": year,
    });

    console.log(jsoninput);

    const res = await fetch(review_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsoninput,
    });

    const json = await res.json();

    if (json.status === 200) {
      window.location.href = window.location.origin + "/dealer/" + id;
    }
  };

  const get_dealer = async () => {
    const res = await fetch(dealer_url, {
      method: "GET"
    });

    const retobj = await res.json();

    if (retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer);
      if (dealerobjs.length > 0) {
        setDealer(dealerobjs[0]);
      }
    }
  };

  const get_cars = async () => {
    const res = await fetch(carmodels_url, {
      method: "GET"
    });

    const retobj = await res.json();

    let carmodelsarr = Array.from(retobj.CarModels);
    setCarmodels(carmodelsarr);
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div style={pageStyles.page}>
      <Header />

      <div style={pageStyles.wrapper}>
        <section style={pageStyles.card}>
          <div style={pageStyles.cardTop}>
            <h2 style={pageStyles.dealerName}>
              {dealer.full_name ? dealer.full_name : "Loading dealership..."}
            </h2>
            <p style={pageStyles.dealerMeta}>
              Tell people what the buying experience was actually like.
            </p>
          </div>

          <div style={pageStyles.form}>
            <div style={{ ...pageStyles.field, marginBottom: "18px" }}>
              <label htmlFor="review" style={pageStyles.label}>Your Review</label>
              <textarea
                id="review"
                rows="7"
                style={pageStyles.textarea}
                placeholder="Write about pricing, staff behavior, delivery process, condition of the car, paperwork, or anything else that mattered."
                onChange={(e) => setReview(e.target.value)}
              ></textarea>
            </div>

            <div style={pageStyles.grid}>
              <div style={pageStyles.field}>
                <label style={pageStyles.label}>Purchase Date</label>
                <input
                  type="date"
                  style={pageStyles.input}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div style={pageStyles.field}>
                <label style={pageStyles.label}>Car Make and Model</label>
                <select
                  name="cars"
                  id="cars"
                  style={pageStyles.input}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="" disabled>Choose Car Make and Model</option>
                  {carmodels.map((carmodel, index) => (
                    <option
                      key={`${carmodel.CarMake}-${carmodel.CarModel}-${index}`}
                      value={carmodel.CarMake + " " + carmodel.CarModel}
                    >
                      {carmodel.CarMake} {carmodel.CarModel}
                    </option>
                  ))}
                </select>
              </div>

              <div style={pageStyles.field}>
                <label style={pageStyles.label}>Car Year</label>
                <input
                  type="number"
                  style={pageStyles.input}
                  onChange={(e) => setYear(e.target.value)}
                  max={2026}
                  min={2015}
                  placeholder="2019"
                />
              </div>
            </div>

            <div style={pageStyles.actionRow}>
              <button style={pageStyles.submitBtn} onClick={postreview}>
                Post Review
              </button>

              <button
                type="button"
                style={pageStyles.secondaryBtn}
                onClick={() => window.location.href = window.location.origin + "/dealer/" + id}
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostReview;