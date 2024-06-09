const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path")
const todo = require("./models/todos.js")
const methodOverride = require('method-override');

app.set("views", path.join(__dirname,"views"))
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

main().then(() => {
    console.log("Connection Successfull");
})
.catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://localhost:27017/Tododb');
}

app.get("/", async (req, res) => {
    let datas = await todo.find();
    res.render("index.ejs", {datas});
});

//Create Rout
app.post("/add", (req, res) => {
    let { task, description, status } = req.body;
    let newtodo = new todo({
        task: task,
        description: description,
        status: status
    });
    newtodo.save().then(res => {console.log("Task was saved")}).catch(err => {console.log(err)});
    res.redirect("/")
});

//Edit Route
app.get("/data/:id/edit", async (req, res) => {
    let {id} = req.params;
    let datas = await todo.findById(id);
    res.render("edit.ejs", {datas})
});

//Update Route
app.put("/data/:id", async (req, res) => {
    let { id } = req.params;
    let {newtask} = req.body;
    let {newdescription} = req.body;
    let updateddata1 = await todo.findByIdAndUpdate(id, { task: newtask, description: newdescription}, {runValidators: true, new: true});
    res.redirect("/")
});


//Update Status Route
app.put("/data/status/:id", async (req, res) =>{
    let { id } = req.params;
    let {newstatus} = req.body;
    let updatestatus = await todo.findByIdAndUpdate(id, { status: newstatus}, {runValidators: true, new: true});
    console.log(updatestatus);
    res.redirect("/")
})



//Destroy Route
app.delete("/data/delete/:id", async (req, res) => {
    let { id } = req.params;
    let tododeleted = await todo.findByIdAndDelete(id);
    res.redirect("/")
})


app.listen(8080, () => {
    console.log("Server is listening on port 8080")
});