import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { BaseUrl } from '../../utils/BaseUrl';
import LinearGradient from 'react-native-linear-gradient'; import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import CustomTextInput from '../../components/organisms/CustomTextInput';
import { usePasswordLoginMutation } from '../../apiServices/login/passwordBased/PasswordLoginApi';
import ButtonNavigateArrow from '../../components/atoms/buttons/ButtonNavigateArrow';
import ButtonNavigate from '../../components/atoms/buttons/ButtonNavigate';
import TextInputRectangularWithPlaceholder from '../../components/atoms/input/TextInputRectangularWithPlaceholder';
import { setAppUserId } from '../../../redux/slices/appUserDataSlice';
import { setAppUserName } from '../../../redux/slices/appUserDataSlice';
import { setAppUserType } from '../../../redux/slices/appUserDataSlice';
import { setUserData } from '../../../redux/slices/appUserDataSlice';
import { setId } from '../../../redux/slices/appUserDataSlice';
import * as Keychain from 'react-native-keychain';
import ErrorModal from '../../components/modals/ErrorModal';
import MessageModal from '../../components/modals/MessageModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalWithBorder from '../../components/modals/ModalWithBorder';
import Icon from 'react-native-vector-icons/Feather';
import Close from 'react-native-vector-icons/Ionicons';
import ButtonOval from '../../components/atoms/buttons/ButtonOval';
import Checkbox from '../../components/atoms/checkbox/Checkbox';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import { useFetchLegalsMutation } from '../../apiServices/fetchLegal/FetchLegalApi';
// import * as Keychain from 'react-native-keychain';  

const PasswordLogin = ({ navigation, route }) => {
  const [username, setUsername] = useState("influencer_2")
  const [passwords, setPasswords] = useState("123456")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState("")
  const [isChecked, setIsChecked] = useState("")

  //modal
  const [openModalWithBorder, setModalWithBorder] = useState(false);

  const width = Dimensions.get('window').width;



  // fetching theme for the screen-----------------------
  const dispatch = useDispatch()
  const userData = useSelector(state => state.appusersdata.userData)
  console.log("userdata",userData)
  const primaryThemeColor = useSelector(
    state => state.apptheme.primaryThemeColor,
  )
    ? useSelector(state => state.apptheme.primaryThemeColor)
    : '#FF9B00';
  const secondaryThemeColor = useSelector(
    state => state.apptheme.secondaryThemeColor,
  )
    ? useSelector(state => state.apptheme.secondaryThemeColor)
    : '#FFB533';
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : '#FFB533';

  const icon = useSelector(state => state.apptheme.icon)
    ? useSelector(state => state.apptheme.icon)
    : require('../../../assets/images/demoIcon.png');

  const buttonThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : '#ef6110';

  const fcmToken = useSelector(state=> state.fcmToken.fcmToken)

  // ------------------------------------------

  // initializing mutations --------------------------------


  const [passwordLoginfunc, {
    data: passwordLoginData,
    error: passwordLoginError,
    isLoading: passwordIsLoading,
    isError: passwordIsError
  }] = usePasswordLoginMutation()

  const [getTermsAndCondition, {
    data: getTermsData,
    error: getTermsError,
    isLoading: termsLoading,
    isError: termsIsError
  }] = useFetchLegalsMutation()

  // ------------------------------------------

  // retrieving data from api calls--------------------------

  useEffect(() => {
    if (passwordLoginData) {
      console.log("Password Login Data", passwordLoginData)
      if (passwordLoginData.success) {
        storeData(passwordLoginData.body)
        saveUserDetails(passwordLoginData.body)
        saveToken(passwordLoginData.body.token)
        setMessage(passwordLoginData.message)
        setModalWithBorder(true)
      }
    }
    else if (passwordLoginError) {
      console.log("Password Login Error", passwordLoginError)
      setError(true)
      setMessage("Login Failed")

    }
  }, [passwordLoginData, passwordLoginError])

  // ------------------------------------------


  const userType = route?.params?.userType
  const userId = route?.params?.userId
  const needsApproval = route?.params?.needsApproval
  console.log("Needs approval", needsApproval)
  const getUserId = (data) => {
    console.log(data)
    setUsername(data)
  }
  const getPassword = (data) => {
    console.log(data)
    setPasswords(data)
  }
  const handleLogin = () => {
    console.log(username, passwords)
    const user_id = username
    const password = passwords
    const fcm_token = fcmToken
    console.log("fcmtoken password login", fcmToken)
    if (user_id !== "" && password !== "" && isChecked) {
      passwordLoginfunc({ user_id, password, fcm_token })
    }
  }

  //modal close
  useEffect(() => {
    console.log("running")
    if (openModalWithBorder == true)
      setTimeout(() => {
        console.log("running2")
        modalWithBorderClose()
      }, 2000);
  }, [success, openModalWithBorder]);

  useEffect(() => {
    fetchTerms();
  }, [])


  useEffect(() => {
    if (getTermsData) {
      console.log("getTermsData", getTermsData?.body?.data?.[0]?.files[0]);
    }
    else if (getTermsError) {
      console.log("gettermserror", getTermsError)
    }
  }, [getTermsData, getTermsError])



  const handleNavigationToRegister = () => {
    // navigation.navigate('BasicInfo',{needsApproval:needsApproval, userType:userType, userId:userId})

    // navigation.navigate('RegisterUser',{needsApproval:needsApproval, userType:userType, userId:userId})
    navigation.navigate("BasicInfo", { needsApproval: needsApproval, userType: userType, userId: userId,navigatingFrom:"PasswordLogin" })

  }

  
  // const handleAppointment = () => {
  //   // navigation.navigate('BasicInfo',{needsApproval:needsApproval, userType:userType, userId:userId})

  //   // navigation.navigate('RegisterUser',{needsApproval:needsApproval, userType:userType, userId:userId})
  //   // navigation.navigate("BasicInfo", { needsApproval: needsApproval, userType: userType, userId: userId,navigatingFrom:"PasswordLogin" })
  //   navigation.navigate('RequestAppointment');


  // }

  const fetchTerms = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      type: "term-and-condition"
    }
    getTermsAndCondition(params)
  }
  
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('loginData', jsonValue);
    } catch (e) {
      console.log("Error while saving loginData", e)
    }
  };

  const saveUserDetails = (data) => {

    try {
      console.log("Saving user details", data)
      dispatch(setAppUserId(data?.user_type_id))
      dispatch(setAppUserName(data?.name))
      dispatch(setAppUserType(data?.user_type))
      dispatch(setUserData(data))
      dispatch(setId(data?.id))
    }
    catch (e) {
      console.log("error", e)
    }
  }

  const getCheckBoxData = (data) => {
    setIsChecked(data)
    console.log("Checkbox data", data)
  }

  const saveToken = async (data) => {
    const token = data
    const password = '17dec1998'

    await Keychain.setGenericPassword(token, password);
  }



  const modalClose = () => {
    setError(false);
    setSuccess(false)
    setMessage('')
    // navigation.navigate('Dashboard')

  };

  //function to handle Modal
  const modalWithBorderClose = () => {
    setModalWithBorder(false);
    navigation.reset({ index: '0', routes: [{ name: 'Dashboard' }] })

    navigation.navigate("Dashboard")

  };

  const ModalContent = () => {
    return (
      <View style={{ width: '100%', alignItems: "center", justifyContent: "center" }}>
        <View style={{ marginTop: 30, alignItems: 'center', maxWidth: '80%' }}>
          <Icon name="check-circle" size={53} color={ternaryThemeColor} />
          <PoppinsTextMedium style={{ fontSize: 27, fontWeight: '600', color: ternaryThemeColor, marginLeft: 5, marginTop: 5 }} content={"Success!"}></PoppinsTextMedium>

          <View style={{ marginTop: 10, marginBottom: 30 }}>
            <PoppinsTextMedium style={{ fontSize: 16, fontWeight: '600', color: "#000000", marginLeft: 5, marginTop: 5, }} content={message}></PoppinsTextMedium>
          </View>

          {/* <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <ButtonOval handleOperation={modalWithBorderClose} backgroundColor="#000000" content="OK" style={{ color: 'white', paddingVertical: 4 }} />
          </View> */}

        </View>

        <TouchableOpacity style={[{
          backgroundColor: ternaryThemeColor, padding: 6, borderRadius: 5, position: 'absolute', top: -10, right: -10,
        }]} onPress={modalClose} >
          <Close name="close" size={17} color="#ffffff" />
        </TouchableOpacity>

      </View>
    )
  }

  return (
    <LinearGradient
      colors={["white", "white"]}
      style={styles.container}>
      {/* <View
        style={{
          height: 140,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            ...styles.semicircle,
            width: width + 60,
            borderRadius: (width + width) / 2,
            height: width + 60,
            top: -(width / 2),
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              style={{height: 20, width: 20, resizeMode: 'contain', right: 90}}
              source={require('../../../assets/images/blackBack.png')}></Image>
          </TouchableOpacity>
          <Image
            style={{
              height: 110,
              width: 140,
              resizeMode: 'contain',
              top: width / 8,
            }}
            source={{uri: `${BaseUrl}/api/images/${icon}`}}></Image>
        </View>
      </View> */}
      <View style={{
        width: '100%', alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ternaryThemeColor,
      }}>
        <View
          style={{
            height: 120,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: ternaryThemeColor,
            flexDirection: 'row',

          }}>

          <TouchableOpacity
            style={{ height: 50, alignItems: "center", justifyContent: 'center', position: "absolute", left: 10, top: 20 }}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              style={{ height: 20, width: 20, resizeMode: 'contain' }}
              source={require('../../../assets/images/blackBack.png')}></Image>
          </TouchableOpacity>
          <Image
            style={{
              height: 50,
              width: 100,
              resizeMode: 'contain',
              top: 20,
              position: "absolute",
              left: 50,



            }}
            source={require('../../../assets/images/ozoneWhiteLogo.png')}></Image>
          {/* ozone change */}
         

          {route.params.userType==="dealer" &&  <View style={{width:150, alignItems: 'center', justifyContent: "center", position: 'absolute', right: 10, top: 10 }}>
            {/* <PoppinsTextMedium style={{fontSize:18}} content ="Don't have an account ?"></PoppinsTextMedium> */}
            <ButtonNavigate
              // handleOperation={handleAppointment}
              backgroundColor="#353535"
              style={{ color: 'white', fontSize: 12, }}
              content="Enquiry"
              navigateTo="RequestAppointment"
              properties={{ needsApproval: needsApproval, userType: userType, userId: userId,navigatingFrom:"PasswordLogin" }}
            >
            </ButtonNavigate>

          </View>}

          {/* {route.params.userType==="sales" &&  <View style={{alignItems: 'center', justifyContent: "center", position: 'absolute', right: 10, top: 10,width:'50%' }}>
            <PoppinsTextMedium style={{fontSize:14,color:'white'}} content ="Don't have an account ?"></PoppinsTextMedium>
            <ButtonNavigate
              // handleOperation={handleAppointment}
              backgroundColor="#353535"
              style={{ color: 'white', fontSize: 16 }}
              content="Enquiry"
              navigateTo="RequestAppointment"
            >
            </ButtonNavigate>

          </View>} */}

          

        </View>
        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginTop: 10,
            width: '90%'
          }}>
          <PoppinsText
            style={{ color: 'white', fontSize: 28 }}
            content="Login To Your Account"></PoppinsText>

        </View>
      </View>
      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}></ErrorModal>
      )}


      <View style={{ marginHorizontal: 100 }}>
        {openModalWithBorder && <ModalWithBorder
          modalClose={modalWithBorderClose}
          message={message}
          openModal={openModalWithBorder}
          comp={ModalContent}></ModalWithBorder>}
      </View>

      <ScrollView contentContainerStyle={{ flex: 1 }} style={{ width: '100%', }}>


        <View style={{ width: "100%", alignItems: "center", justifyContent: "center", marginTop: 30 }}>
          {/* <CustomTextInput sendData={getUserId} title="Username" image={require('../../../assets/images/whiteUser.png')}></CustomTextInput>
            <CustomTextInput sendData={getPassword} title="Password" image={require('../../../assets/images/whitePassword.png')}></CustomTextInput> */}


          <TextInputRectangularWithPlaceholder
            placeHolder="UserName"
            handleData={getUserId}
          // maxLength={10}
          ></TextInputRectangularWithPlaceholder>



          <TextInputRectangularWithPlaceholder
            placeHolder="Password"
            handleData={getPassword}
            keyboardType = "password"
          // maxLength={10}
          ></TextInputRectangularWithPlaceholder>


        </View>

        <View style={{ flexDirection: 'row', marginHorizontal: 24, marginLeft: 32, marginBottom: 8 }}>
          <Checkbox CheckBoxData={getCheckBoxData} />
          <TouchableOpacity onPress={() => {
            navigation.navigate('PdfComponent', { pdf: getTermsData.body.data?.[0]?.files[0] })
          }}>
            <PoppinsTextLeftMedium content={"I agree to the Terms & Conditions"} style={{ color: '#808080', marginHorizontal: 30, marginBottom: 20, fontSize: 15, marginLeft: 8, marginTop: 16 }}></PoppinsTextLeftMedium>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center', width: '90%' }}>
          <PoppinsTextMedium style={{ color: "#727272", fontSize: 14 }} content="Not remembering password? "></PoppinsTextMedium>
          <TouchableOpacity >
            <PoppinsTextMedium style={{ color: ternaryThemeColor, fontSize: 14 }} content="Forget Password"></PoppinsTextMedium>
          </TouchableOpacity>
        </View>

        <View style={{ width: "100%", flex: 1 }}>
          <View style={{ marginBottom: 27, marginLeft: 20, marginTop: 'auto' }}>
            <ButtonNavigateArrow
              handleOperation={handleLogin}
              backgroundColor={buttonThemeColor}
              style={{ color: 'white', fontSize: 16 }}
              isChecked={isChecked}
              content="Login">
            </ButtonNavigateArrow>
          </View>

        </View>



      </ScrollView>



    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    width: '100%',
    alignItems: 'center'
  },
  semicircle: {
    backgroundColor: 'white',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  banner: {
    height: 184,
    width: '90%',
    borderRadius: 10,
  },
  userListContainer: {
    width: '100%',
    height: 600,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
});

export default PasswordLogin;