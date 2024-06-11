const BASE_URL = "https://join-d217a-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Fetches data from the specified path in the database.
 * 
 * @param {string} [path=""] - The path in the database to fetch data from.
 * @returns {Promise<Object>} The data fetched from the database.
 */
async function getData(path="") {
    let response = await fetch(BASE_URL + path + ".json");
    return await response.json();
}


/**
 * Posts data to the specified path in the database.
 * 
 * @param {string} [path=""] - The path in the database to post data to.
 * @param {Object} [data={}] - The data to be posted to the database.
 * @returns {Promise<Object>} The response from the database after posting data.
 */
async function postData(path="", data={}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}


/**
 * Updates data at the specified path in the database.
 * 
 * @param {string} [path=""] - The path in the database to update data at.
 * @param {Object} [data={}] - The data to be updated in the database.
 * @returns {Promise<Object>} The response from the database after updating data.
 */
async function putData(path="", data={}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}


/**
 * Deletes data at the specified path in the database.
 * 
 * @param {string} [path=""] - The path in the database to delete data from.
 * @returns {Promise<Object>} The response from the database after deleting data.
 */
async function deleteData(path="") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    return await response.json();
}
