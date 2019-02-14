
import EXIF from 'exif-js'
var fileFuc={
    uploadfiles(vm,filenum,files){
        return  new Promise((resolve,reject)=>{        
            let pAll=[];
            let img_w,img_h;
            let baseArr=[],filesArr=[];
            let data={};
            
            for(let i=0;i<filenum;i++){
                pAll.push(
                    new Promise(function(resolve, reject){
                        var Orientation = null; 
                        EXIF.getData(files[i], function() {  
                            EXIF.getAllTags(this);   
                            Orientation = EXIF.getTag(this, 'Orientation'); 
                        }); 
                        
                        let newImg = new Image();
                        var reader = new FileReader();
                        reader.readAsDataURL(files[i]);  
                        
                        reader.onload = function (event) {
                            var result = event.target.result;
                            newImg.src=result;
                            newImg.onload=function(){             
                                if(newImg.width>newImg.height&&newImg.width>750){
                                    img_w=750;
                                    img_h=(newImg.height/newImg.width)*750;
                                }else if(newImg.width<newImg.height&&newImg.height>750){
                                    img_h=750;
                                    img_w=(newImg.width/newImg.height)*750;
                                }else{
                                    img_w=newImg.width;
                                    img_h=newImg.height;
                                }
        
                                let canvas=document.createElement('canvas');
                                canvas.setAttribute("width", img_w);
                                canvas.setAttribute("height", img_h);
        
                                let ctx=canvas.getContext('2d');
                                ctx.fillStyle = "#fff";
                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                                ctx.drawImage(this, 0, 0, img_w, img_h);
 
                                if(Orientation != "" && Orientation != 1){  
                                    switch(Orientation){  
                                        case 6://需要顺时针（向左）90度旋转 
                                        fileFuc.rotateImg(this,img_w,img_h,'left',canvas); 
                                            break;  
                                        case 8://需要逆时针（向右）90度旋转   
                                        fileFuc.rotateImg(this,img_w,img_h,'right',canvas);  
                                            break;  
                                        case 3://需要180度旋转  
                                        fileFuc.rotateImg(this,img_w,img_h,'right',canvas);
                                        fileFuc.rotateImg(this,img_w,img_h,'right',canvas);//转两次  
                                            break;  
                                    }         
                                }
                                let imgsrc = canvas.toDataURL('image/jpeg',0.7);
        
                                var bytes = window.atob(imgsrc.split(",")[1]);
                                var buffer = new ArrayBuffer(bytes.length);
                                var ubuffer = new Uint8Array(buffer);
        
                                for (var i = 0; i < bytes.length; i++) {
                                    ubuffer[i] = bytes.charCodeAt(i);
                                }
                                var blob=new Blob( [buffer] , {type : 'image/jpeg'});
                                
                                filesArr.unshift(blob)
                                baseArr.unshift(imgsrc)
                                resolve()
                            }
                        }
                    })
                )
            
            }
                
            Promise.all(pAll).then(function () {
                data={
                    filesArr,
                    baseArr
                }
                resolve(data)
            })
            
        })
        
    },
    rotateImg(img,img_w,img_h, direction,canvas){
        //最小与最大旋转方向，图片旋转4次后回到原方向    
        var min_step = 0;    
        var max_step = 3;    
        if (img == null)return;    
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错    
        var height = img_h;    
        var width = img_w;    
        var step = 2;    
        if (step == null) {    
            step = min_step;    
        }    
        if (direction == 'right') {    
            step++;    
            //旋转到原位置，即超过最大值    
            step > max_step && (step = min_step);    
        } else {    
            step--;    
            step < min_step && (step = max_step);    
        }    
        
        //旋转角度以弧度值为参数    
        var degree = step * 90 * Math.PI / 180;    
        var ctx = canvas.getContext('2d');    
        switch (step) {    
            case 0:    
                canvas.width = width;    
                canvas.height = height;    
                ctx.drawImage(img, 0, 0,img_w,img_h);    
                break;    
            case 1:    
                canvas.width = height;    
                canvas.height = width;    
                ctx.rotate(degree);    
                ctx.drawImage(img, 0, -height,img_w,img_h);    
                break;    
            case 2:    
                canvas.width = width;    
                canvas.height = height;    
                ctx.rotate(degree);    
                ctx.drawImage(img, -width, -height,img_w,img_h);    
                break;    
            case 3:    
                canvas.width = height;    
                canvas.height = width;    
                ctx.rotate(degree);    
                ctx.drawImage(img, -width, 0,img_w,img_h);    
                break;    
        }  
    }
}
export default fileFuc