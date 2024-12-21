import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import styles from "./styles/LiveInsights.module.scss";
import { parse, differenceInMilliseconds } from "date-fns";
import { Alert, MicroLoading } from "../../../microInteraction";

function Card2({ img }) {
    return (
        <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true }}
        >

            <div className={styles.card_img2}>
                <img src="https://i.ibb.co/C7vcpB8/image-4.png" alt="GSOC" />
            </div>
        </motion.div>
    );
}

function Card({ img }) {
    return (
        <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true }}
        >

            <div className={styles.card_img}>
                <img src="https://i.ibb.co/93dDdyJ/Picyard-1734689449494-deblurred.png" alt="GSOC" />
            </div>
        </motion.div>
    );
}


function LiveInsights({ ongoingEvents, isRegisteredInRelatedEvents }) {
    const authCtx = useContext(AuthContext);
    const [alert, setAlert] = useState(null);
    const [remainingTime, setRemainingTime] = useState("");
    const [info, setInfo] = useState({});
    const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);
    const navigate = useNavigate();
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const [navigatePath, setNavigatePath] = useState("/");
    const [isMicroLoading, setIsMicroLoading] = useState(false);
    const [relatedEventId, setRelatedEventId] = useState(null);
    const [btnTxt, setBtnTxt] = useState("REGISTER NOW");

    useEffect(() => {
        if (alert) {
            const { type, message, position, duration } = alert;
            Alert({ type, message, position, duration });
            setAlert(null); // Reset alert after displaying it
        }
    }, [alert]);

    useEffect(() => {
        if (shouldNavigate) {
            navigate(navigatePath);
            setShouldNavigate(false);
        }
    }, [shouldNavigate, navigatePath, navigate]);

    const handleButtonClick = () => {
        if (!authCtx.isLoggedIn) {
            setIsMicroLoading(true);
            sessionStorage.setItem("prevPage", window.location.pathname);
            setNavigatePath("/login");
            setShouldNavigate(true);
        } else {
            handleForm();
        }
    };

    const handleForm = () => {
        if (authCtx.isLoggedIn) {
            setIsMicroLoading(true);
            if (authCtx.user.access !== "USER" && authCtx.user.access !== "ADMIN") {
                setTimeout(() => {
                    setIsMicroLoading(false);
                    setAlert({
                        type: "info",
                        message: "Team Members are not allowed to register for the Event",
                        position: "bottom-right",
                        duration: 3000,
                    });
                }, 1500);
            } else {
                const relatedEventId = ongoingEvents.find(
                    (e) => e.info.relatedEvent === "null"
                )?.id;
                if (relatedEventId) {
                    setNavigatePath(`/Events/${relatedEventId}/Form`);
                    setShouldNavigate(true);
                }
                setTimeout(() => {
                    setIsMicroLoading(false);
                }, 3000);
            }
        }
    };

    const calculateRemainingTime = () => {
        if (!info?.regDateAndTime) {
            setRemainingTime(null);
            return;
        }

        // Parse the regDateAndTime received from backend
        try {
            const regStartDate = parse(
                info.regDateAndTime,
                "MMMM do yyyy, h:mm:ss a",
                new Date()
            );
            const now = new Date();

            // Calculate the time difference in milliseconds
            const timeDifference = differenceInMilliseconds(regStartDate, now);

            if (timeDifference <= 0) {
                setRemainingTime(null);
                return;
            }

            // Calculate the days, hours, minutes, and seconds remaining
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
            const seconds = Math.floor((timeDifference / 1000) % 60);

            let remaining;

            if (days > 0) {
                remaining = `${days} day${days > 1 ? "s" : ""} left`;
            } else {
                remaining = [
                    hours > 0 ? `${hours}h ` : "",
                    minutes > 0 ? `${minutes}m ` : "",
                    seconds > 0 ? `${seconds}s` : "",
                ]
                    .join("")
                    .trim();
            }

            console.log(remaining);
            setRemainingTime(remaining);
        } catch (error) {
            console.error("Date parsing error:", error);
            setRemainingTime(null);
        }
    };

    // useEffect(() => {
    //     const ongoingInfo = ongoingEvents.find(
    //       (e) => e.info.relatedEvent === "null"
    //     )?.info;

    //     setInfo(ongoingInfo);
    //     setIsRegistrationClosed(ongoingInfo?.isRegistrationClosed || false);

    //     const relatedId = ongoingEvents.find(
    //       (e) => e.info.relatedEvent === "null"
    //     )?.id;
    //     setRelatedEventId(relatedId);

    //     if (ongoingInfo?.regDateAndTime) {
    //       calculateRemainingTime();
    //       const intervalId = setInterval(calculateRemainingTime, 1000);
    //       return () => clearInterval(intervalId);
    //     }
    //   }, [info?.regDateAndTime, ongoingEvents]);

    // useEffect(() => {
    //     const updateButtonText = () => {
    //       if (isRegistrationClosed) {
    //         setIsMicroLoading(false);
    //         setBtnTxt("CLOSED");
    //       } else if (!authCtx.isLoggedIn) {
    //         setIsMicroLoading(false);
    //         setBtnTxt(remainingTime || "REGISTER NOW");
    //       } else {
    //         setIsMicroLoading(false);
    //         if (authCtx.user.access !== "USER") {
    //           if (remainingTime) {
    //             setBtnTxt(remainingTime);
    //           } else {
    //             setBtnTxt("ALREADY MEMBER");
    //           }
    //         } else if (isRegisteredInRelatedEvents) {
    //           if (authCtx.user.regForm.includes(relatedEventId)) {
    //             setIsMicroLoading(false);
    //             setBtnTxt("ALREADY REGISTERED");
    //           }
    //         } else {
    //           setIsMicroLoading(false);
    //           setBtnTxt(remainingTime || "REGISTER NOW");
    //         }
    //       }
    //     };

    //     updateButtonText();
    //   }, [
    //     isRegistrationClosed,
    //     authCtx.isLoggedIn,
    //     authCtx.user?.access,
    //     remainingTime,
    //     isRegisteredInRelatedEvents,
    //     relatedEventId,
    // ]);

    return (
        <div>
            <div className={styles.circle}></div>
            <div className={styles.circle2}></div>
            <h1>GET <span className={styles.para}>LIVE</span> INSIGHTS AND INSPIRATION</h1>
            <div className={styles.mid}>
                <div className={styles.outerbox}>
                    <Card src="https://i.ibb.co/93dDdyJ/Picyard-1734689449494-deblurred.png" alt="GSOC image" />
                    <div className={styles.flex1}>
                        <h2>KICK OFF YOUR JOURNEY WITH RIGHT GUIDANCE FROM GSOC ALUMNI</h2>
                        <div className={styles.mid}><Card2 src="https://i.ibb.co/C7vcpB8/image-4.png" alt="GSOC Logo" /><h2>Tailored Strategies for Success</h2></div>
                        <div className={styles.mid}><Card2 src="https://i.ibb.co/C7vcpB8/image-4.png" alt="GSOC Logo" /><h2>Insider Tips for Winning Proposals</h2></div>
                        <div className={styles.mid}><Card2 src="https://i.ibb.co/C7vcpB8/image-4.png" alt="GSOC Logo" /><h2>Real-Life Inspiration</h2></div>
                    </div>
                </div>
            </div>
            <div className={styles.mid}>
                <button
                    onClick={handleButtonClick}
                    disabled={
                        isMicroLoading ||
                        isRegistrationClosed ||
                        btnTxt === "CLOSED" ||
                        btnTxt === "ALREADY REGISTERED" ||
                        btnTxt === "ALREADY MEMBER" ||
                        btnTxt === remainingTime
                    }
                    style={{
                        cursor:
                            isRegistrationClosed ||
                                btnTxt === "CLOSED" ||
                                btnTxt === "ALREADY REGISTERED" ||
                                btnTxt === "ALREADY MEMBER" ||
                                remainingTime
                                ? "not-allowed"
                                : "pointer",
                    }}
                >
                    {isMicroLoading ? (
                        <MicroLoading color="#38ccff" />
                    ) : (
                        btnTxt
                    )}
                </button>
            </div>
            <Alert />
        </div>
    );
}

export default LiveInsights;