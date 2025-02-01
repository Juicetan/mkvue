import fs from 'fs';

function File(path){
  this.initData(path);
};

File.prototype.initData = function(path){
  this.path = path;
  if(path){
    this.data = fs.readFileSync(path,'utf8');
  }
};

File.prototype.saveData = function(){
  return fs.writeFileSync(this.path,this.data);
};

export default File;