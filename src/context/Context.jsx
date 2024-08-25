import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState(false);

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt) => {

        setResultData("");
        setLoading(true);
        setShowResult(true);

        let response;
        if (prompt !== undefined) {
            response = await run(prompt);
            setRecentPrompt(prompt);
        } else {
            setPrevPrompts(prev => [...prev, input]);
            setRecentPrompt(input);
            response = await run(input);
        }

        // console.log(response);

        // adding breaks instead of \n in response
        let responseStr = response.split("\n").join("</br>");
        // console.log(responseStr);

        // removing ** and adding strong tag instead of it
        let responseArray = responseStr.split("**");
        // console.log(responseArray);
        let responseStr2 = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i == 0 || i % 2 !== 1) {
                responseStr2 += responseArray[i];
            }
            else {
                responseStr2 += "<strong>" + responseArray[i] + "</strong>";
            }
        }
        // console.log(responseStr2);

        // spliting by break tags and checking if ## includes in response then adding strong tag and making response text bold and checking if * includes in response then adding list tag around it and adding break tags to other elements not having * in it 
        let responseArray2 = responseStr2.split("</br>");
        let responseStr3 = "";
        // console.log(responseArray2);
        for (let i = 0; i < responseArray2.length; i++) {
            if (responseArray2[i].includes("##")) {
                responseArray2[i] = responseArray2[i].replace("##", "");
                responseArray2[i] = "<strong>" + responseArray2[i] + "</strong>";
            }

            if (responseArray2[i].includes("*")) {
                responseArray2[i] = responseArray2[i].replace("*", "");
                responseArray2[i] = "<li>" + responseArray2[i] + "</li>";
            }
            else {
                responseArray2[i] = responseArray2[i] + "</br>";
            }
            responseStr3 += responseArray2[i];
        }
        // console.log(responseArray2);

        let newResponseArray = responseStr3.split(" ");
        // console.log(newResponseArray);
        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord + " ");
        }

        setLoading(false);
        setInput("");
    }

    const contextValue = {
        input,
        setInput,
        recentPrompt,
        setRecentPrompt,
        prevPrompts,
        setPrevPrompts,
        showResult,
        loading,
        resultData,
        onSent,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;