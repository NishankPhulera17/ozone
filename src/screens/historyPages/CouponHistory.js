import React, { useEffect } from 'react';
import {View, StyleSheet,TouchableOpacity,Image,FlatList} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useAllUserPointsEntryMutation,useFetchUserPointsHistoryMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import * as Keychain from 'react-native-keychain';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useGetAllRedeemedCouponsMutation } from '../../apiServices/workflow/rewards/GetCouponApi';
import { useGetAllUserCouponsMutation } from '../../apiServices/coupons/getAllCouponsApi';

const CouponHistory = ({navigation}) => {
    const [getAllRedeemedFunc,{
        data:getAllRedeemedData,
        error:getAllRedeemedError,
        isLoading:getAllRedeemedIsLoading,
        isError:getAllRedeemedIsError
    }] = useGetAllRedeemedCouponsMutation()

    const [getAllCouponsFunc,{
        data:getAllCouponsData,
        error:getAllCouponsError,
        isLoading:getAllCouponsIsLoading,
        isError:getAllCouponsIsError
    }] = useGetAllUserCouponsMutation()

  const userData = useSelector(state => state.appusersdata.userData)
  console.log("userdata is",userData)

    useEffect(()=>{
        const getRedemptionData=async()=>{
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
              console.log(
                'Credentials successfully loaded for user ' + credentials.username
              );
              const token = credentials.username
              getAllRedeemedFunc({
                token:token
            })
            const body = {
                app_user_id:String(userData.id),
                token:token
            }
            getAllCouponsFunc(body)
        }
        
        
    }
    getRedemptionData()
        
    },[])

    useEffect(()=>{
        if(getAllRedeemedData)
    {
        console.log("getAllRedeemedData",getAllRedeemedData.body.data)
    }
    else if(getAllRedeemedError){
        console.log("getAllRedeemedError",getAllRedeemedError)
    }
},[getAllRedeemedError,getAllRedeemedData])

useEffect(()=>{
    if(getAllCouponsData)
{
    console.log("getAllCouponsData",getAllCouponsData)
}
else if(getAllCouponsError){
    console.log("getAllCouponsError",getAllCouponsError)
}
},[getAllCouponsError,getAllCouponsData])


    const CouponItems=(props)=>{
        const refNo =props.refNo
        const couponCode = props.couponCode
        const redeemedOn = props.redeemedOn
        const expiresOn = props.expiresOn
        const data = props.data
        console.log(data)
        return(
            <TouchableOpacity onPress={()=>{navigation.navigate('CouponDetails',{
                data:data
            })}} style={{padding:10,alignItems:"center",justifyContent:"center",borderColor:'grey',borderRadius:10,margin:10,width:'44%',backgroundColor:'#F8F8F8',elevation:4}}>
                <View style={{height:80,width:80,alignItems:"center",justifyContent:"center",borderRadius:40,backgroundColor:"white"}}>
                <Image style={{height:50,width:50,resizeMode:"contain"}} source={require('../../../assets/images/voucher.png')}></Image>
                </View>
                <View style={{alignItems:"center",justifyContent:"center"}}>
                    <PoppinsTextMedium style={{color:'grey',fontSize:12}} content="Ref Number"></PoppinsTextMedium>
                    <PoppinsTextMedium style={{color:'black',fontSize:12,fontWeight:'700'}} content={refNo}></PoppinsTextMedium>
                </View>
                <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>
                    <PoppinsTextMedium style={{color:'grey',fontSize:12}} content="Coupon Code"></PoppinsTextMedium>
                    <PoppinsTextMedium style={{color:'black',fontSize:12,fontWeight:'700'}} content={couponCode}></PoppinsTextMedium>
                </View>
                <View style={{alignItems:"center",justifyContent:"center",marginTop:20,borderTopWidth:1,borderBottomWidth:1,borderStyle:'dotted',flexDirection:'row',padding:4,width:'100%',}}>
                    <PoppinsTextMedium style={{color:'grey',fontSize:12}} content="Redeemed on"></PoppinsTextMedium>
                    <PoppinsTextMedium style={{color:'grey',fontSize:12,marginLeft:4}} content={redeemedOn}></PoppinsTextMedium>
                </View>
               
                
            </TouchableOpacity>
        )
    }

    return (
        <View style={{alignItems:'center',justifyContent:"center",backgroundColor:"white"}}>
            <View style={{alignItems:"center",justifyContent:"flex-start",flexDirection:"row",width:'100%',marginTop:10,height:40,marginLeft:20}}>
                <TouchableOpacity onPress={()=>{
                    navigation.goBack()
                }}>
            <Image style={{height:24,width:24,resizeMode:'contain',marginLeft:10}} source={require('../../../assets/images/blackBack.png')}></Image>

                </TouchableOpacity>
            <PoppinsTextMedium content ="Coupon History" style={{marginLeft:10,fontSize:16,fontWeight:'600',color:'#171717'}}></PoppinsTextMedium>
            
            </View>
            <View style={{padding:14,alignItems:"center",justifyContent:"flex-start",width:"100%",flexDirection:"row",borderBottomWidth:1,borderColor:'#DDDDDD',borderStyle:'dashed'}}>
                <View style={{alignItems:"center"}}>
                <PoppinsTextMedium style={{marginLeft:10,fontSize:18,fontWeight:'600',color:'#6E6E6E'}} content="You Have Redeemed"></PoppinsTextMedium>
                {getAllRedeemedData &&
                <PoppinsText style={{marginLeft:14,fontSize:34,fontWeight:'600',color:'#373737'}} content={getAllCouponsData?.body.length}></PoppinsText>

                }
                <PoppinsTextMedium style={{marginLeft:10,fontSize:20,fontWeight:'600',color:'#6E6E6E'}} content="Coupon"></PoppinsTextMedium>
                </View>
                <Image style={{height:80,width:80,resizeMode:'contain',position:'absolute',right:20}} source={require('../../../assets/images/voucher.png')}></Image>
                 </View>
                
                 {getAllCouponsData && <FlatList
                style={{width: '100%'}}
                contentContainerStyle={{alignItems:"center",justifyContent:"center",paddingBottom:100,width: '100%'}}
                data={getAllCouponsData.body}
                
                numColumns={2}
                refreshing={true}
                renderItem={({item, index}) => (
                 <CouponItems 
                data={item}
                key ={index} refNo={item.ref_no} couponCode={item.brand_product_code} redeemedOn={moment(item.updated_at).format("DD-MM-YYYY")} ></CouponItems> 
                )}></FlatList>}
                
        </View>
    );
}

const styles = StyleSheet.create({})

export default CouponHistory;
