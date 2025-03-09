import { App } from "@components/App";
import ReactDOM from "react-dom/client";

// body에 div 추가 후 div에 <App /> 렌더
const rootElement = document.createElement("div");
document.body.prepend(rootElement);
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
