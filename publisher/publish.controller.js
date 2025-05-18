import  Pub  from "./publish.model.js"


export async function getPublisher(req, res) {
    let { id } = req.params;
    try {
        if (!id)
            return res.status(404).json({ message: "Publisher not found" })
        let publisher = await Pub.getPublisher(id);
        return res.status(200).json({ message: "got publisher", publisher })

    }
    catch (err) {
        console.error("could not get publisher", err)
    }
}

export async function createPublisher(req, res) {
    let { name, password, email } = req.body;
    if (!name || !password || !email)
        return res.status(400).json({ message: "missing info" })
    const publisher = new Pub(name, password, email);
    await publisher.createPublisher();
    return res.status(200).json({ message: "publisher created", publisher })
}
