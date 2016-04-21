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

