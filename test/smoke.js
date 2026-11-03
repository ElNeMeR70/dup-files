const {spawnSync}=require("child_process");
const r=spawnSync("node",[require("path").join(__dirname,"..","index.js"),"--help"],{input:"{}",encoding:"utf8"});
if(r.error){console.error(r.error);process.exit(1)}
console.log("smoke ok (script executes)");
