/**计算公式：
 Amount of Coverage的值
 ADD&D= Coverage select 值*1
 AMR= Coverage select 值*0.1
 ADHI= Coverage select 值：常值1000
 Plan: 选择ADD&D后，相应的AMR、ADHI变空。。

 Total Premium  计算出。。

 Level Principal Amout of Coverage值决定下面的153或306
 选择100000时           选择200000 。。。。。
 class1*153              306
 class2*192              384

 * **/

var CoverageA=[100000,200000,300000,400000,500000],
    ClassGroup_ADDD=[//CoverageA每个数组元素对应对应ClassGroup_ADDD中的一种区间
        [153,192,306,384],[306,384,612,768],[459,576,918,1152],[612,768,1224,1536],[765,960,1530,1920]
        //10000 20000  30000 40000 50000
    ],
    ClassGroup_ADDD_AMR=[
        [264,328,525,656],[522,649,1039,1299],[780,970,1553,1942],[1038,1291,2067,2585],[1296,1612,2581,3228]
    ],
    ClassGroup_ADDD_HIB=[
        [253,312,496,604],[406,504,802,988],[559,696,1108,1372], [712,888,1414,1756],[865,1080,1720,2140]
    ],
    ClassGroup_ADDD_AMR_HIB=[
        [364,448,715,876], [622,769,1229,1519],[880,1090,1743,2162], [1138,1411,2257,2805],[1396,1732,2771,3448]
    ];

var ClassGrouup=[ClassGroup_ADDD,ClassGroup_ADDD_AMR,ClassGroup_ADDD_HIB,ClassGroup_ADDD_AMR_HIB];
var isSubmit=true;//是否可提交
function CorporatePA(){}
CorporatePA.prototype={
    init:function(){
        var that=this;
        that.evt();
    },
    changeCallback:function(OP,val2){
        var ckA00TR=OP.find('.ckA00 tbody tr');
        ckA00TR.eq(0).find('td:last').html(formatComma(val2*1));
        ckA00TR.eq(1).find('td:last').html(formatComma(val2*0.1));
        ckA00TR.eq(2).find('td:last').html('1,000.00/day');//常量
        var Oplan=OP.find('.plan').val();
        switch(Oplan){
            case 'ADD&D+AMR+HIB':break;
            case 'ADD&D':ckA00TR.eq(1).find('td:last').html('-'); ckA00TR.eq(2).find('td:last').html('-');break;
            case 'ADD&D+AMR':ckA00TR.eq(2).find('td:last').html('-');break;
            case 'ADD&D+HIB':ckA00TR.eq(1).find('td:last').html('-');break;
        }
    },
    getLevelData:function(){
        var companyMsg=getLocal('bm999');//获取本地数据
        var sendJson={//传给c++的数据
            CompanyName:companyMsg.CompanyName, NatureOfBusiness:companyMsg.NatureOfBusiness,
            code:companyMsg.code,type:companyMsg.type,PaymentMode:$('.PaymentMode').val(),option:[]
        };
        var dataCal=$('.Repeat_dataCal .dataCal');
        for(var i= 0,L=dataCal.length;i<L;i++){
            /**
             * option11-option12--option13
             * eg:sendJson={option1: Array[0], option2: Array[0], option3: Array[0]}
             * **/
           // sendJson['option'+(i+1)]=[];
           // var currOpt=sendJson['option'+(i+1)];//产生N个option字段
            var CurrdataCal=$('.Repeat_dataCal>.dataCal').eq(i);//某个option
            var Nav62=CurrdataCal.find('.nav6-2');//某个option下的所有nav6-2
            var currOpt=[];
            for(var j= 0,M=Nav62.length;j<M;j++){
                var CurrNav62=CurrdataCal.find('.nav6-2').eq(j);//某个option下的某个level
                var numInp=CurrNav62.find('.ckA01 input[type=number]');
                var s0=parseInt(numInp.eq(0).val()),s1=parseInt(numInp.eq(1).val()),
                    s2=parseInt(numInp.eq(2).val()),s3=parseInt(numInp.eq(3).val());
                if(s0+s1+s2+s3<1||isNaN(s0)&&isNaN(s1)&&isNaN(s2)&&isNaN(s3)){
                    console.log('当前level不存');
                    continue;
                }
                var trData=CurrNav62.find('.ckA01 tbody tr');//某个option下的某个level下的填写的数据
                var smallControl=CurrdataCal.find('.smallControl .q000').eq(j);//某个level的名称【第2个nav6-2对应的就是第2个q000】
                var a0=trData.eq(0),a1=trData.eq(1),a2=trData.eq(2),a3=trData.eq(3);
                var obj={
                    title:smallControl.html(),Plan:CurrNav62.find('.plan').val(),
                    Coverage:CurrNav62.find('.Coverage').val(),

                    totalNum:trData.eq(4).find('td').eq(1).html(),
                    totalPremlum:trData.eq(4).find('td:last').html(),
                    class:[
                        {name:'class1',num:a0.find('input').val()||'0',total:a0.find('td:last').html()},
                        {name:'class2',num:a1.find('input').val()||'0',total:a1.find('td:last').html()},
                        {name:'class3',num:a2.find('input').val()||'0',total:a2.find('td:last').html()},
                        {name:'class4',num:a3.find('input').val()||'0',total:a3.find('td:last').html()}
                    ]//暂时不用for实现
                };
                currOpt.push(obj)
            }
            sendJson.option.push(currOpt);
        }
        return sendJson;
    },
    evt:function(){
        var that=this;
        $('.CorporatePAsel').delegate('.nav6-2 .Coverage','change',function(){//下拉框：Level Principal Amout of Coverage
            var _this=$(this);
            var OP=_this.parents('.nav6-2'),val2=parseInt(_this.val());
            that.changeCallback(OP,val2);
        });
        $('.CorporatePAsel').delegate('.nav6-2 .plan','change',function(){//下拉框：Plan
            var _this=$(this);
            setTimeout(function(){
                if(prevNextPlan()==false){
                    alert(msgABC.t62);
                    return false;
                }
                var OP=_this.parents('.nav6-2');
                var val2=parseInt(OP.find('.Coverage').val());
                that.changeCallback(OP,val2);
           },30);

        });
        $('.CorporatePAsel').delegate('.ckA01 input','blur',function(){//4个input框和范围为5-100
            var _this=$(this);
            var op=_this.parents('.nav6-2');
            var ck101=op.find('.ckA01');
            if(inputV(_this,msgABC.t11)==false){//验证。。
                return false;
            };//验证。。
            op.find('.q20,.q39,.q29').html('-');
           // return false;防止2次
        });

        $('.CorporatePAsel').delegate('.dataCal .Calculate','click',function(){//计算
            var _this=$(this);
            var OP=_this.parents('.dataCal');
            OP.find('.nav6-2').each(function(){
                var currNav=$(this);
                var ind=currNav.find('.Coverage option:checked').index();//决定arr[0][1]中的1
                var Find=currNav.find('.plan option:checked').index();//决定arr[0][1]中的0
                var threeArr=ClassGrouup[Find][ind];
                console.log('当前nav6-2，选中的Coverage索引值:选中的级别费率',ind,'----',ClassGrouup,threeArr);
                var ckA01=currNav.find('.ckA01 tbody tr');
                var smallTotal= 0,smallTotal_person= 0,numL=ckA01.length;
                ckA01.each(function(j){
                    var val2_1=ckA01.eq(j).find('input').val()*1;
                    if(val2_1<0||isNaN(val2_1)){
                        ckA01.eq(j).find('input').val(0);
                        val2_1=0;
                    }
                    var totalZ=val2_1*(threeArr[j]);
                    if(j==numL-1){
                        if(smallTotal==0){smallTotal='-';}
                        if(smallTotal_person==0){smallTotal_person='-';}
                        ckA01.eq(j).find('td:last').html(formatComma(smallTotal));
                        ckA01.eq(j).find('td').eq(1).html(smallTotal_person);
                        if(smallTotal=='-'){smallTotal=0;}//用于后面的计算  smallTotal+=totalZ;
                    }
                    else{
                        if(totalZ==0){totalZ='-';}
                        ckA01.eq(j).find('td:last').html(formatComma(totalZ));
                        if(totalZ=='-'){totalZ=0;};//用于后面的计算  smallTotal+=totalZ;
                    }
                    smallTotal+=totalZ;
                    smallTotal_person+=val2_1;
                });//ckA01 end
            });//.nav6-2 end
            return false;
        });//click end


        $('.btnCorporatePATrueJump').click(function(){//页面跳转。
            linkClkFix();                              
            isSubmit=true;//初始化为可以提交
            var OdataCal=$('.Repeat_dataCal .dataCal');

            for(var j= 0,L=OdataCal.length;j<L;j++){//总的option
                var currOpt=OdataCal.eq(j);
                isSubmit=classV100Merge(currOpt,'.ckA01 tbody tr input',[100,5],msgABC.t50);
                if(isSubmit==false){//不能提交
                    break;
                }
            }

            if(isSubmit==false){//不能提交
                return false;
            }
            var mc=needNum();//4个险种中必须有一个输入框【Number of lives】内有值
            if(mc==0){//不能提交
                alert(msgABC.t10);return false;
            }
            if(prevNextPlan()==false){//不能提交
                alert(msgABC.t62);return false;
            }

            for(var j= 0,L=$('.dataCal').length;j<L;j++){
                $('.dataCal').eq(j).find('.Calculate').click();
            }

            var isEqual=option_livesEqual();//每个option的总人数要相同
            if(isEqual==false){//不能提交
                alert(msgABC.t36);
                return false;
            }

            var companyMsg=getLocal('bm999');//获取本地数据
            if(companyMsg==-1){
                alert(msgABC.t35);
                return false;
            }
            var objC=that.getLevelData();//传给后台的最终数据
            ObjectCFun(objC);
            return false;
        });//group_proposalDetail.html
    }
};

function prevNextPlan(){
    /**
     * 一个option内部，后面的level只能选跟前面的level相同或者更高的plan（plan 1到4，后面的比前面的高），
     * 例如，如果level1选了plan1，level2可以选择plan 1-4，如果level2选了plan2，那么level3只能选plan2-4，以此类推
     * **/
    var dataCal=$('.dataCal'),arrB=[];
    for(var j=0;j<dataCal.length;j++){
        var currDataCal=dataCal.eq(j);
        var planGroup=currDataCal.find('.plan');
        arrB[j]=[];
        for(var k=0;k<planGroup.length;k++){
            arrB[j].push($('option:selected',planGroup.eq(k)).index());
        }
    }
    //console.log(arrB);//eg:[[0,1,2],[2,3],[2,3]]
    for(var c=0;c<arrB.length;c++){
        var currArr=arrB[c];
        for(var m=1;m<currArr.length;m++){
            if(currArr[m-1]>currArr[m]){
                return false;
            }
        }
    }
    return true;
}
function option_livesEqual(){
    var  OdataCal=$('.CorporatePAsel .dataCal'),arrA=[],arrB=[];
    OdataCal.each(function(j){
        var numT=$(this).find('.q29');
        arrA[j]=[],arrB[j]=0;
        numT.each(function(m){
            var t3=parseFloat( numT.eq(m).html() );
            arrA[j].push(t3);
            arrB[j]=arrB[j]+t3;
        });
    });
    console.group('人数统计:start');
    console.log('单个：',arrA,'总的',arrB);//[[5,7],[9,3,4]]
    console.groupEnd('人数统计:end');
    return arrNumEqual(arrB);
}

function ObjectCFun(objC){//后台加代码
	var objC=updataRecord(objC);
    console.log('后台最终需要的数据数据:',objC);

    //rtnData是后台返回的数据
    var rtnData={succ:1,cid:'recor34234d33N123'};//该条记录的id，通过id可查看该条记录填写的内容
    //localStorage.cid=rtnData.cid;
    /***dyc 8.31 start(跳转页面前存)***/
    var bm999=getLocal('bm999');
    var sendObj={
        cid:-1,pid:rtnData.cid,staus:-1,isFrom:'create',createStatus:'12',
        Otype:bm999.type,CompanyName:bm999.CompanyName,NatureOfBusiness:bm999.NatureOfBusiness, code:bm999.code
    };
    dataUpdateSession(sendObj);
    /***dyc 8.31 end(跳转页面前存)***/
   // location.href=$('.btnCorporatePATrueJump').attr('shref');

}
$(function(){
   new CorporatePA().init();
   currRecordModified();
});


window.groupJsonData = {//全局，方便底部的跳转时存储数据
    NatureofBusiness: 'a233333232432454543543',
    data: {
        isShow:true,CompanyName: 'a1', NatureofBusiness: 'a233333232432454543543', Address1: 'a3', Address2: 'a4',Address3: 'add23',
        Title: 'a5',AddresseeFirstName: 'a6', AddresseeLastName: 'a7',Designation: 'a9',
        TelNo: 'a10',FaxNo: 'a11', EmailAddress: 'a12',ContacePerson: 'a13',city:'WF',province:'SD'
    },coverage:{ChildSecure: "false",CorporateEssentials: "true",CorporatePA: "true",ProGuard: "true"}
};//notBNAEvent 使用。测试数据。。。

function Group(){}
Group.prototype={
    init:function(){
        var that=this;
        var modulePage=getLocal('modulePage');
            that.reset();//初始化
            that.isBNA();//是否来自BNA判断
            that.event();//事件
            if(modulePage.isFrom!='-1'){//dyc 是顶部导航跳转的..9.10
                that.jDefVal();//设置值和触发li事件
            }
    },
    jDefVal:function(){//设置值
        var mPage=getLocal('modulePage');
        $('#listAutoCom').html('<ul><li code="'+mPage.code+'">'+mPage.CompanyName+'</li></ul>');
        setTimeout(function(){
            $('#listAutoCom li:first').click();
            setTimeout(function(){
                    $('.popDetail').attr('clk',1);//detail可以单击.
                    $('#clkCo input').removeAttr('checked');
                    $('#clkCo input[value="'+mPage.type+'"]').attr('checked','checked');
            },60)
                   
        },120)
    },
    reset:function(){//dyc modi 8.28
        $('#cCompanyName,#cNatureofBusiness').val('');
        $('#cCompanyName').removeAttr('code');
    },
    isBNA:function(){
        var that=this;
        if(localStorage.isFromeBNA=='true'){//从BNA中过来
            console.log('从BNA中过来');
            that.getBNAData();
        }
        else{//直接进来
            that.notBNA();
        }
    },
    getBNAData:function(){//BNA
        var that=this;
        $('#cCompanyName').attr('readonly','readonly');
        var isFromeBNAData=JSON.parse(localStorage.isFromeBNAData);//BNA带过来的
        $('#cNatureofBusiness').val(isFromeBNAData.NatureofBusiness);
        $('#cCompanyName').val(isFromeBNAData.data.CompanyName).attr('code',isFromeBNAData.data.code);
        that.dataVal(isFromeBNAData);
        $('#NatureofBusiness').html(isFromeBNAData.NatureofBusiness);
        $('.popDetail').attr('clk',1);//detail可以单击.
    },
    notBNA:function(){
        var that=this;
        $('.hideL').hide();
        var isFromNewEditClient=localStorage.isFromNewEditClient;
        if(isFromNewEditClient&&isFromNewEditClient!=-1){//从newClient 或 editClient进来的
            console.log('new Edit client进来');
            that.isNewEditClient();
        }
        else{
            console.log('直接进来');
            this.notBNAEvent();//直接进来
        }
    },
    isNewEditClient:function(){
        var that=this;
        var objC=localStorage.isFromeNewEditClientData;
        objC=JSON.parse(objC);
        $('#cCompanyName').attr('readonly','readonly');
        $('#cNatureofBusiness').val(objC.data.NatureofBusiness);
        $('#cCompanyName').val(objC.data.CompanyName).attr('code',objC.data.code);
        that.dataVal(objC);
        $('.popDetail').attr('clk',1);//detail可以单击.
        $('#NatureofBusiness').html(objC.data.NatureofBusiness,14);
    },
    dataVal:function(dat){
        var that=this;
        setValJson(dat.data,false); //弹出框赋值 /**false代表不是input表单元素而只是普通的标签***/
        that.isClkCoverage(dat.coverage);
    },
    isClkCoverage:function(coverage){
        var oTR=$('#clkCo tr'),COV=coverage;
        if(COV){
            oTR.eq(0).attr('clk',COV.CorporateEssentials).find('.hideL').html(COV.CorporateEssentials=='true'?'YES':'NO');
            oTR.eq(1).attr('clk',COV.ProGuard).find('.hideL').html(COV.ProGuard=='true'?'YES':'NO');
            oTR.eq(2).attr('clk',COV.ChildSecure).find('.hideL').html(COV.ChildSecure=='true'?'YES':'NO');
            oTR.eq(3).attr('clk',COV.CorporatePA).find('.hideL').html(COV.CorporatePA=='true'?'YES':'NO');;
        }
    },
    notBNAEvent:function(){
        var that=this;
        if($('#cCompanyName').length){
            $('#cCompanyName')[0].addEventListener("input",function(){
				/**初始化 start***/
                $('.radiusA em input').removeAttr('checked');
                $('.radiusA em').removeClass('selBj');
				$('#cCompanyName').removeAttr('code');
				$('#cNatureofBusiness').val('');
				$('.popDetail').attr('clk',0);
                $('.globalMS em,.currQuestionTemplate,.currQuestion').html('');
                $('.hideC').hide();//初始化
				/**初始化 end***/ 
				
                var mData={data:[{code:1,name:'Acting as if nothing borne in mind is the best revenge.It is all for myself to live better.Apologizing does not always mean you are wrong & the other person is right. It just means you value your relationship more than your ego.'},{code:2,name:'软通2'}]};//测试数据
                if(mData.data.length<1){
                    $('.listAutoCom').hide();
                }
                var temp1= YayaTemplate(document.getElementById('tempList_text').innerHTML);
                var ck=temp1.render({sData:mData.data});
                $("#listAutoCom").html(ck).show();//下拉列表
            },false);
        }// end if

        $('.autocompleteLay').delegate('.ps li','click',function(){//自动完成的下拉 clk
            var _this=$(this);
            //alert('li触发了')
            //groupJsonData 是请求后获得的数据：groupJsonData
			 $('.popDetail').attr('clk',1);//
            $('#cCompanyName').val(_this.html()).attr('code',_this.attr('code'));

            $('#cNatureofBusiness').val(groupJsonData.NatureofBusiness);//groupJsonData全局的
            $('.autocompleteLay .ps ul').hide();
            that.dataVal(groupJsonData);
            that.isClkCoverage(groupJsonData.coverage);
            $('#NatureofBusiness').html(groupJsonData.NatureofBusiness);
            /**
             * succ:  if(data.isShow==false){  alert(tipMsg.a2); return false;}//如果有题，且不报错时
             * coverage:{ChildSecure: "false",CorporateEssentials: "true",CorporatePA: "true",ProGuard: "false"}
             * **/
        });
    },
    event:function(){
        $('.GeneralInformation').delegate('#clkCo tr input','click',function(){//禁止选择
            var Otr=$(this).parents('tr');
            if(Otr.attr('clk')=='false'){
                Otr.find('input').removeAttr('checked');
                alert(msgABC.t41);
                return false;
            }
            if($('#cCompanyName').val().length<1){
                alert(msgABC.t42);
                return  false;
            }
        });

        $('.selectedCategory').click(function(){
            var selectedElem=$('.GeneralInformation table input:checked');
            if(selectedElem.length<1||$('#cCompanyName').val().length<1){
                alert(msgABC.t43);
                return false;
            }
			var code=$('#cCompanyName').attr('code');
			if(!code){
				alert(msgABC.t7);
				return false;
			}
            var shtml=selectedElem.attr('shref');
            var currLocal={
                CompanyName:$('#cCompanyName').val(),NatureOfBusiness:$('#cNatureofBusiness').val(),
                code:$('#cCompanyName').attr('code'),type:selectedElem.val()
            };
            setLocal('bm999',currLocal);
            /***dyc 8.31 start(跳转页面前存)***/
            var sendObj={
                cid:-1,pid:-1,//cid、pid值现在都没有
                staus:-1,Otype:$('input[name="c3"]:checked').val(),isFrom:'create',createStatus:'11',
                CompanyName:currLocal.CompanyName,NatureOfBusiness:currLocal.NatureOfBusiness, code:currLocal.code
            };
            dataUpdateSession(sendObj);
            console.log(sendObj);
            /***dyc 8.31 end(跳转页面前存)***/
            setTimeout(function(){
                location.href=shtml;
            },120)
            
            return false;
        });//group.html
        $('#clkCo tr a').click(function(){
            pdfShow($(this).attr('otype'));
            return false;
        });//打开pdf
    }
};

$(function(){
    new Group().init();
    currRecordModified();
});

