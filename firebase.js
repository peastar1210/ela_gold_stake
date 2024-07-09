import { initializeApp } from "firebase/app";
import {
	getDatabase,
	ref,
	set,
	push,
	update,
	get,
	child,
} from "firebase/database";
import { tokenList } from "./utils/tokenList";
import axios from "axios";
import { base } from "viem/chains";

const firebaseConfig = {
	apiKey: "AIzaSyDtglvWW-xPpa51LdttqeiDAv0iwzZkxME",
	authDomain: "elastos-project.firebaseapp.com",
	projectId: "elastos-project",
	storageBucket: "elastos-project.appspot.com",
	messagingSenderId: "820390819547",
	appId: "1:820390819547:web:69665f6eb28fbabcaabefe",
	measurementId: "G-BGFG9RWYG5",
};

// Initialize firebase app.
const app = initializeApp(firebaseConfig);

// Initialize firebase database and get the reference of firebase database object.
const database = getDatabase(app);

// Setting the data.
const data = [...tokenList];
set(ref(database, "tokenList"), data)
	.then(() => {
		// Success.
		console.log("Success", data);
	})
	.catch((error) => {
		console.log(error);
	});

set(ref(database, "updateDate"), new Date().toISOString())
	.then(() => {
		// Success.
		console.log("Success");
	})
	.catch((error) => {
		console.log(error);
	});

get(child(ref(database), "tokenList"))
	.then((snapshot) => {
		if (snapshot.exists()) {
			let data = snapshot.val();
			console.log("getData", data);
			return data;
		} else {
			console.log("Data not available");
			return null;
		}
	})
	.catch((error) => {
		console.error(error);
		return null;
	});

const updatePool = async () => {
	const updates = {};

	let newPools, pool, poolToUpdate;
	let base_token, base_token_address;
	let quote_token;
	let tokenList, updateDate;
	try {
		newPools = await axios.get(
			"https://api.geckoterminal.com/api/v2/networks/ela/new_pools?page=1"
		);
		console.log("newPools", newPools);
		if (!newPools || newPools.data.length === 0) return;

		const poolOperate = async () => {
			for (let i = 0; i < newPools.data.data.length; i++) {
				pool = newPools.data.data[i];
				console.log("pool", pool);
				base_token = pool.attributes.name.split(" / ")[0];
				base_token_address =
					"0x" + pool.relationships.base_token.data.id.split("0x")[1];
				quote_token = pool.attributes.name.split(" / ")[1];

				const foundToken = tokenList.find(
					(token) => token.address === base_token_address
				);

				if (!foundToken) {
					poolToUpdate = await axios.get(
						`https://api.geckoterminal.com/api/v2/networks/ela/tokens/${base_token_address}/pools?page=1`
					);

					if (poolToUpdate) {
						tokenList = [
							...tokenList,
							{
								symbol: base_token,
								address: base_token_address,
								poolAddress: poolToUpdate.data.data[0].attributes.address,
							},
						];
						updates["tokenList"] = [...tokenList];
					}
				}
			}
			updates["updateDate"] = new Date().toISOString();

			update(ref(database), updates)
				.then(() => {
					console.log("Update Database is Successful.");
				})
				.catch((error) => {
					console.log(error);
				});
		};

		get(child(ref(database), "tokenList"))
			.then(async (snapshot) => {
				if (snapshot.exists()) {
					tokenList = snapshot.val();

					await poolOperate();
				} else {
					console.log("Data not available");
				}
			})
			.catch((error) => {
				console.error(error);
			});
	} catch (err) {
		console.log("Error: ", err);
	}
};

get(child(ref(database), "updateDate"))
	.then(async (snapshot) => {
		if (snapshot.exists()) {
			let updateDate = snapshot.val();

			if (new Date() > new Date(updateDate) + 24 * 60 * 60 * 1000)
				await updatePool();
		} else {
			console.log("Data not available");
		}
	})
	.catch((error) => {
		console.error(error);
	});

export { database };
