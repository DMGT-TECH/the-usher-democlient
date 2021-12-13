/* globals Cookies THEUSHER_TOKEN_COOKIE_NAME BACKEND_RESOURCE_BASEURL IMG_WAITING IMG_BLANK_PIXEL */

async function callMathServiceResource(operationName) {
  document.getElementById("waitingIconImage").src = IMG_WAITING;
  const HEADERS = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + Cookies.get(THEUSHER_TOKEN_COOKIE_NAME),
    left: document.getElementById("left").value,
    right: document.getElementById("right").value
  };

  const RESPONSE = await fetch(
    BACKEND_RESOURCE_BASEURL + operationName,
    {
      method: "POST",
      headers: HEADERS
    }
  );

  const TEXT = await RESPONSE.text();
  try {
    const RESULT = JSON.parse(TEXT)["result"];
    document.getElementById("result").value = RESULT;
  } catch (err) {
    alert('The backend resource responded with: "' + TEXT + '"');
  }
  document.getElementById("waitingIconImage").src = IMG_BLANK_PIXEL;


}

async function runAddBackendResource() {
  callMathServiceResource("add");
}

async function runSubtractBackendResource() {
  callMathServiceResource("sub");
}

async function runDivideBackendResource() {
  callMathServiceResource("div");
}
