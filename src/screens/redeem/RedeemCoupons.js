import React, {useEffect, useId, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';
import Plus from 'react-native-vector-icons/Entypo';
import Minus from 'react-native-vector-icons/Entypo';
import Check from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {useFetchGiftCatalogueByUserTypeAndCatalogueTypeMutation} from '../../apiServices/gifts/GiftApi';
import {useFetchUserPointsMutation} from '../../apiServices/workflow/rewards/GetPointsApi';
import * as Keychain from 'react-native-keychain';
import {BaseUrlImages} from '../../utils/BaseUrlImages';
import ErrorModal from '../../components/modals/ErrorModal';
import SuccessModal from '../../components/modals/SuccessModal';
import MessageModal from '../../components/modals/MessageModal';
import PointHistory from '../historyPages/PointHistory';
import { useGetAllCouponsMutation } from '../../apiServices/coupons/getAllCouponsApi';

const RedeemCoupons = ({navigation,route}) => {
  const [search, setSearch] = useState();
  const [cart, setCart] = useState([]);
  const [distinctCategories, setDistinctCategories] = useState([]);
  const [displayContent, setDisplayContent] = useState([])
  const [pointBalance, setPointBalance] = useState()
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false)
  const action = route.params?.action
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const secondaryThemeColor = useSelector(
    state => state.apptheme.secondaryThemeColor,
  )
    ? useSelector(state => state.apptheme.secondaryThemeColor)
    : '#FFB533';
  const userId = useSelector(state => state.appusersdata.id);
  let tempPoints=0;
  const [
    fetchAllCouponsFunc,
    {data: fetchAllCouponsData, error: fetchAllCouponsError},
  ] = useGetAllCouponsMutation();

  const [
    userPointFunc,
    {
      data: userPointData,
      error: userPointError,
      isLoading: userPointIsLoading,
      isError: userPointIsError,
    },
  ] = useFetchUserPointsMutation();


  useEffect(() => {
    const getData = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          'Credentials successfully loaded for user ' + credentials.username,
        );
        const token = credentials.username;
        const params = {userId: userId, token: token};
        userPointFunc(params);
        fetchAllCouponsFunc(token);
      }
    };
    getData();
    setCart([])
  }, []);
  
  useEffect(() => {
    if (fetchAllCouponsData) {
      console.log('fetchAllCouponsData', fetchAllCouponsData);
      getDistinctCategories(fetchAllCouponsData.body)
      setDisplayContent(fetchAllCouponsData.body)
      
    } else if (fetchAllCouponsError) {
      console.log('fetchAllCouponsError', fetchAllCouponsError);
    }
  }, [fetchAllCouponsData, fetchAllCouponsError]);

  useEffect(() => {
    if (userPointData) {
      console.log('userPointData', userPointData);
      if(userPointData.success)
      {
        setPointBalance(userPointData.body.point_balance)
      }
    } else if (userPointError) {
      console.log('userPointError', userPointError);
    }
  }, [userPointData, userPointError]);



  const getDistinctCategories=(data)=>{
    let allCategories = []

    for(var i=0;i<data.length;i++)
    {
      allCategories.push(fetchAllCouponsData.body[i].brand_name)
    }
    const set = new Set(allCategories)
    const arr = Array.from(set)
    setDistinctCategories(arr)
    console.log("setDistinctCategories",arr)
  }

  const modalClose = () => {
    setError(false);
    setSuccess(false)
  };

  const handleSearch=(data)=>{
    const searchOutput =  fetchAllCouponsData.body.filter((item,index)=>{
      return(item.name.toLowerCase().includes(data.toLowerCase()))
    })
    setDisplayContent(searchOutput)

  }

  const Categories = props => {
    const image = props.image;
    const data = props.data;
    return (
      <TouchableOpacity 
      onPress={()=>{
        const filteredData =  fetchAllCouponsData.body.filter((item,index)=>{
          return(
            item.category == data
          )
        })
        setDisplayContent(filteredData)
      }}
        style={{
          marginLeft: 30,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            height: 40,
            width: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 35,
            marginLeft: 0,
            backgroundColor: secondaryThemeColor,
          }}>
          <Image
            style={{height: 30, width: 30, resizeMode: 'contain'}}
            source={image}></Image>
        </View>
        <PoppinsTextMedium
          style={{
            color: 'black',
            fontSize: 14,
            fontWeight: '600',
            marginTop: 2,
          }}
          content={data}></PoppinsTextMedium>
      </TouchableOpacity>
    );
  };
  const addItemToCart=(data,operation,count)=>{
    let tempCount=0
    let temp=cart
    console.log("data",data)
   
    if(operation==="plus")
    {
      
      temp.push(data)
      setCart(temp)
      
    }
    else {
      // setPointBalance(pointBalance+Number(data.points))
      for(var i =0;i<temp.length;i++)
      {
        if(temp[i].id===data.id)
        {
        tempCount++
        if(tempCount===1)
        {
          temp.splice(i,1)
        }
        
        }       
        
      }
      
      setCart(temp)

    }
    
    console.log(temp)

  }
  
  
  const RewardsBox = props => {
    const [count, setCount] = useState(0)
    
    const image = props.image
    const points =props.points
    const product = props.product
    const category = props.category
    const data = props.data
    console.log("data",data)
    
   const changeCounter=(operation)=>{
    
    
      
    
    console.log(pointBalance,"tempPoints",tempPoints,data.value)
    if(operation==="plus")
    {
      console.log(Number(pointBalance),Number(data.value))
      if(tempPoints+Number(data.value)<=pointBalance)
    {
      if(Number(pointBalance)>=Number(data.value))
    {
      if(cart.length<1)
      {
        tempPoints =  tempPoints+Number(data.value)
      let temp =count
      temp++
      setCount(temp)
      props.handleOperation(data,operation,temp)
      }
      else {
        alert("Kindly redeem one coupon at a time")
      }
      
      
    }
    else{
      setError(true)
      setMessage("Sorry you don't have enough points.")
    }
    }
      

     
    }
    else{
      let temp =count
      temp--
      setCount(temp)
      props.handleOperation(data,operation,temp)
      tempPoints = tempPoints-data.points

      if(cart.length==0)
      {
        tempPoints=0;
      }

      // setPointBalance(pointBalance+data.points)

    }
   }

   

    return (
      <TouchableOpacity
        onPress={()=>{console.log("Pressed")}}
        style={{
          height: 120,
          width: '90%',
          alignItems: 'center',
          justifyContent: 'flex-start',
          borderWidth: 0.6,
          borderColor: '#EEEEEE',
          backgroundColor: '#FFFFFF',
          margin: 10,
          marginLeft: 20,
          elevation: 4,
        }}>
        <View
          style={{
            height: '40%',
            width: '100%',
            backgroundColor: secondaryThemeColor,
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
          }}>
          <View
            style={{
              height: 50,
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 0.4,
              borderColor: '#DDDDDD',
              backgroundColor: 'white',
              marginLeft: 20,
              top: 14,
            }}>
            <Image
              style={{height: 50, width: 50, resizeMode: 'contain'}}
              source={{uri:image}}></Image>
          </View>
          <LinearGradient
            style={{
              height: 30,
              padding: 4,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              borderRadius: 4,
              position: 'absolute',
              right: 80,
            }}
            colors={['#FF9100', '#E4C52B']}>
            <Image
              style={{height: 20, width: 20, resizeMode: 'contain'}}
              source={require('../../../assets/images/coin.png')}></Image>
            <PoppinsTextMedium
              style={{
                fontSize: 12,
                color: 'white',
                fontWeight: '700',
                marginLeft: 10,
              }}
              content={`Points : ${points}`}></PoppinsTextMedium>
          </LinearGradient>
          <View style={{alignItems:"center",justifyContent:"center",flexDirection:'row',position: 'absolute',
              right: 10}}>
                <TouchableOpacity onPress={()=>{if(count>0)
                {
                  changeCounter("minus")
                }}}>
          <Minus name ="minus" color='black' size={24}></Minus>

                </TouchableOpacity>

            <View
            style={{
              height: 24,
              width: 20,
              backgroundColor: 'white',
              
              borderRadius: 4,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
           <PoppinsTextMedium style={{color:'black',fontSize:14,fontWeight:'700'}} content ={count}></PoppinsTextMedium>
          </View>
          <TouchableOpacity onPress={()=>{
                changeCounter("plus")
                }}>
          <Plus name="plus" color='black' size={20}></Plus>

                </TouchableOpacity>

          </View>
          
        </View>
        <View
          style={{
            height: '60%',
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginTop: 4,
            width: '90%',
          }}>
          <PoppinsTextMedium
            style={{color: 'black', fontSize: 13, width: '90%', marginLeft: 4}}
            content={product}></PoppinsTextMedium>

          <PoppinsTextMedium
            style={{color: '#919191', fontSize: 13, width: '90%'}}
            content={category.substring(0,25)}></PoppinsTextMedium>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: ternaryThemeColor,
        height: '100%',
      }}>
        {error && (
            <ErrorModal
              modalClose={modalClose}
              message={message}
              openModal={error}></ErrorModal>
          )}
          {success && (
            <MessageModal
              modalClose={modalClose}
              message={message}
              openModal={success}></MessageModal>
          )}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          width: '100%',
          marginTop: 10,
          height: '10%',
          marginLeft: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: 'contain',
              marginLeft: 10,
            }}
            source={require('../../../assets/images/blackBack.png')}></Image>
        </TouchableOpacity>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <PoppinsTextMedium
            content="Redeem Points"
            style={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: '700',
              color: 'white',
            }}></PoppinsTextMedium>
          <PoppinsTextMedium
            content={`${pointBalance} pts available`}
            style={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: '700',
              color: 'white',
            }}></PoppinsTextMedium>
        </View>
      </View>
      <View
        style={{
          height: '90%',
          width: '100%',
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
          alignItems: 'center',
          justifyContent: 'flexx-start',
          backgroundColor: 'white',
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            backgroundColor: '#EFF6FC',
            width: '100%',
            borderTopRightRadius: 40,
            borderTopLeftRadius: 40,
            paddingBottom: 20,
          }}>
          {fetchAllCouponsData && <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              marginTop: 20,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                height: 40,
                width: '80%',
                backgroundColor: 'white',
                borderRadius: 20,
              }}>
              <Icon
                style={{position: 'absolute', left: 10}}
                name="magnifying-glass"
                size={30}
                color={ternaryThemeColor}></Icon>
              <TextInput
                style={{marginLeft: 20,width:'70%'}}
                placeholder="Type Product Name"
                value={search}
                onChangeText={text => {
                  handleSearch(text)
                }}></TextInput>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 10,
              }}>
              <Image
                style={{height: 26, width: 26, resizeMode: 'contain'}}
                source={require('../../../assets/images/settings.png')}></Image>
            </View>
          </View>}
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            flexDirection: 'row',
            marginTop: 10,
          }}>
          <TouchableOpacity
          onPress={()=>{
            setDisplayContent(fetchAllCouponsData.body)
          }}
            style={{
              height: 70,
              width: 70,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{height: 40, width: 40, resizeMode: 'contain'}}
              source={require('../../../assets/images/categories.png')}></Image>
            <PoppinsTextMedium
              style={{
                color: 'black',
                fontSize: 14,
                fontWeight: '600',
                marginTop: 2,
              }}
              content="All"></PoppinsTextMedium>
          </TouchableOpacity>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
            {distinctCategories && distinctCategories.map((item,index)=>{
              return(
                <Categories
                key ={index}
              data={item}
              image={require('../../../assets/images/box.png')}></Categories>
              )
            })}
          </ScrollView>
        </View>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 300,
          }}>
          <PoppinsTextMedium
            style={{
              color: '#171717',
              fontSize: 14,
              fontWeight: '700',
              marginTop: 10,
              marginBottom: 10,
            }}
            content="Rewards"></PoppinsTextMedium>
          {displayContent && (
            <FlatList
              data={displayContent}
              style={{width: '100%'}}
              contentContainerStyle={{width: '100%'}}
              renderItem={({item, index}) => {
                
                return (
                  <RewardsBox
                  handleOperation={addItemToCart}
                    data={item}
                    key={index}
                    product={item.brand_name}
                    category={item.category}
                    points={item.value}
                    image={item.brand_image}></RewardsBox>
                );
              }}
              keyExtractor={item => item.id}
            />
          )}
        </View>
        <TouchableOpacity onPress={()=>{
          if(cart.length!==0)
          {
            navigation.navigate("CouponCartList",{cart:cart})
          }
          else (
            setError(true),
            setMessage("Cart cannot be empty")
          )
          
        }} style={{alignItems:"center",borderRadius:10,justifyContent:'center',height:50,width:'60%',backgroundColor:ternaryThemeColor,position:'absolute',bottom:20}}>
            <PoppinsTextMedium style={{color:'white',fontSize:16,fontWeight:'700'}} content = "Continue"></PoppinsTextMedium>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default RedeemCoupons;
