const BASE_URL = "https://join-d217a-default-rtdb.europe-west1.firebasedatabase.app/";

async function getData(path="") {
    let response = await fetch(BASE_URL + path + ".json");
    return await response.json();
}


async function postData(path="", data={}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}


async function putData(path="", data={}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}


async function deleteDate(path="") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    return  await response.json();
}