import { useRef, useState, useEffect } from 'react';
import {StyleSheet, Text } from 'react-native';
import Fonts from '../common/Fonts';

export default function AnimatedTyping(props) {
    let [text, setText] = useState("");
    let [cursorColor, setCursorColor] = useState("transparent");
    let [messageIndex, setMessageIndex] = useState(0);
    let [textIndex, setTextIndex] = useState(0);
    let [timeouts, setTimeouts] = useState({
        cursorTimeout: undefined,
        typingTimeout: undefined,
        firstNewLineTimeout: undefined,
        secondNewLineTimeout: undefined,
    });

    let textRef = useRef(text);
    textRef.current = text;

    let cursorColorRef = useRef(cursorColor);
    cursorColorRef.current = cursorColor;

    let messageIndexRef = useRef(messageIndex);
    messageIndexRef.current = messageIndex;

    let textIndexRef = useRef(textIndex);
    textIndexRef.current = textIndex;

    let timeoutsRef = useRef(timeouts);
    timeoutsRef.current = timeouts;

    let typingAnimation = () => {
        if (textIndexRef.current < props.text[messageIndexRef.current].length) {
            setText(textRef.current + props.text[messageIndexRef.current].charAt(textIndexRef.current));
            setTextIndex(textIndexRef.current + 1);

            let updatedTimeouts = { ...timeoutsRef.current };
            updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 50);
            setTimeouts(updatedTimeouts);
        } else if (messageIndexRef.current + 1 < props.text.length) {
            setMessageIndex(messageIndexRef.current + 1);
            setTextIndex(0);

            let updatedTimeouts = {...timeoutsRef.current};
            updatedTimeouts.firstNewLineTimeout = setTimeout(newLineAnimation, 60);
            updatedTimeouts.secondNewLineTimeout = setTimeout(newLineAnimation, 100);
            updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 140);
            setTimeouts(updatedTimeouts);
        } else {
            clearInterval(timeoutsRef.current.cursorTimeout);
            setCursorColor("transparent");

            if (props.onComplete) {
                props.onComplete();
            }
        }
    };

    let newLineAnimation = () => {
        setText(textRef.current + "\n");
    };

    let cursorAnimation = () => {
        if (cursorColorRef.current === "transparent") {
            setCursorColor("#8EA960");
        } else {
            setCursorColor("transparent");
        }
    };

    useEffect(() => {
        let updatedTimeouts = { ...timeoutsRef.current };
        updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 800);
        updatedTimeouts.cursorTimeout = setInterval(cursorAnimation, 400);
        setTimeouts(updatedTimeouts);

        return () => {
            clearTimeout(timeoutsRef.current.typingTimeout);
            clearTimeout(timeoutsRef.current.firstNewLineTimeout);
            clearTimeout(timeoutsRef.current.secondNewLineTimeout);
            clearInterval(timeoutsRef.current.cursorTimeout);
        };
    }, []);

    return (
        <Text style={styles.text}>
            {text}
            {/* <Text style={{paddingHorizontal:10, letterSpacing:0.2, color: 'black', fontSize:15, marginTop:15, fontFamily: Fonts.Regular}}>|</Text> */}
        </Text>
    )
};

let styles = StyleSheet.create({
    text: {
        color: "#000000",
        fontSize:25, marginTop:15, fontFamily: Fonts.Allura,
        alignSelf: "stretch"
    }
})