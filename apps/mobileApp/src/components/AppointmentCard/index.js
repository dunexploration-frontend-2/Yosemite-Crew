import {Image, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {styles} from '../../screens/Home/DashboardTab/bookAppointment/appointmentHistory/styles';
import {colors} from '../../../assets/colors';
import GText from '../GText/GText';
import GButton from '../GButton';
import {scaledValue} from '../../utils/design.utils';
import {Images} from '../../utils';
import {useTranslation} from 'react-i18next';
import GImage from '../GImage';
import LinearGradient from 'react-native-linear-gradient';

const AppointmentCard = ({
  imageSource,
  doctorName,
  department,
  qualifications,
  hospitalName,
  appointmentTime,
  showCancel = false,
  navigation,
  confirmed,
  buttonImg,
  buttonText,
  showButton,
  monthly,
  appointmentTitle,
  onPress,
  swiperCardStyle,
  doctorNameTextStyle,
  departmentTextStyle,
  buttonStyle,
  buttonTextStyle,
  buttonIconStyle,
  pending,
  petImage,
  dashBoard,
}) => {
  const {t} = useTranslation();

  return (
    <View
      style={[
        styles.swiperCard,
        {
          backgroundColor: confirmed || monthly ? colors.white : colors.appRed,
        },
        swiperCardStyle,
      ]}>
      <View style={styles.cardInnerView}>
        <GImage image={imageSource} style={styles.doctorImgStyle} />
        <View style={styles.infoView}>
          <GText
            GrMedium
            componentProps={{numberOfLines: 1}}
            text={doctorName}
            style={[
              styles.doctorNameText,
              {
                color: confirmed || monthly ? '#090A0A' : colors.white,
              },
              doctorNameTextStyle,
            ]}
          />
          <GText
            SatoshiBold
            componentProps={{numberOfLines: 1}}
            text={department}
            style={[
              styles.departmentText,
              {
                color: confirmed || monthly ? colors.jetBlack : '#FFFEFE',
                marginTop: confirmed || monthly ? scaledValue(4) : 0,
                textTransform: 'capitalize',
              },
              departmentTextStyle,
            ]}
          />
          <GText
            SatoshiBold
            componentProps={{numberOfLines: 1}}
            text={qualifications}
            style={[
              styles.departmentText,
              {
                color: confirmed || monthly ? colors.jetBlack : '#FFFEFE',
              },
              departmentTextStyle,
            ]}
          />
          <GText
            SatoshiBold
            componentProps={{numberOfLines: 2, ellipsizeMode: 'tail'}}
            text={hospitalName}
            style={[
              styles.departmentText,
              {
                color: confirmed || monthly ? colors.jetBlack : '#FFFEFE',
                maxWidth: '90%',
              },
            ]}
          />
        </View>
      </View>
      {monthly && (
        <TouchableOpacity onPress={onPress} style={styles.customButton}>
          <GText GrMedium text={t('see_prescription_string')} />
          <Image source={Images.RightArrow} style={styles.arrowStyle} />
        </TouchableOpacity>
      )}
      {!monthly && (
        <>
          <View
            style={[
              styles.buttonStyle,
              {backgroundColor: '#F5E1C94D'},
              buttonStyle,
            ]}>
            <Image
              source={Images.Calender}
              style={[
                styles.iconStyle,
                {
                  tintColor: confirmed ? colors.jetBlack : colors.white,
                  opacity: 0.7,
                },
                buttonIconStyle,
              ]}
            />
            <GText
              text={appointmentTime}
              style={[
                styles.buttonText,
                confirmed && {color: colors.jetBlack, opacity: 0.7},
                buttonTextStyle,
              ]}
            />
          </View>
        </>
      )}
      {showButton && (
        <View
          style={[
            styles.buttonView,
            confirmed && {paddingBottom: scaledValue(8)},
          ]}>
          <GButton
            icon={buttonImg || Images.Direction}
            iconStyle={[
              styles.iconStyle,
              {tintColor: confirmed ? colors.appRed : colors.white},
            ]}
            title={buttonText}
            textStyle={[styles.buttonText, confirmed && {color: colors.appRed}]}
            style={[
              styles.buttonDirectionStyle,
              confirmed && {
                borderWidth: scaledValue(1),
                borderColor: colors.appRed,
              },
            ]}
          />
          <GButton
            onPress={() => {
              navigation?.navigate('StackScreens', {
                screen: 'ChatScreen',
              });
            }}
            icon={Images.Chat}
            iconStyle={[
              styles.iconStyle,
              {tintColor: confirmed ? colors.white : colors.appRed},
            ]}
            title={'Chat'}
            textStyle={[
              styles.buttonText,
              {color: confirmed ? colors.white : colors.appRed},
            ]}
            style={[
              styles.buttonChatStyle,
              confirmed && {backgroundColor: colors.appRed},
            ]}
          />
        </View>
      )}

      {pending && (
        <GButton
          onPress={() => {
            if (monthly) {
              navigation?.navigate('StackScreens', {
                screen: 'BookAppointment',
              });
            }
          }}
          icon={Images.CircleClose}
          iconStyle={styles.iconStyle}
          title={`  ${appointmentTitle}`}
          textStyle={[styles.buttonText, pending && {color: colors.appRed}]}
          style={[
            styles.buttonStyle,
            {backgroundColor: 'transparent', marginBottom: scaledValue(1)},
          ]}
        />
      )}

      {showCancel && (
        <GButton
          onPress={() => {
            if (monthly) {
              navigation?.navigate('StackScreens', {
                screen: 'BookAppointment',
              });
            }
          }}
          icon={monthly ? Images.Calender : Images.CircleClose}
          iconStyle={styles.iconStyle}
          title={appointmentTitle}
          textStyle={[styles.buttonText, monthly && {color: colors.jetBlack}]}
          style={[
            styles.buttonStyle,
            {
              backgroundColor: 'transparent',
              marginBottom: scaledValue(0),
              gap: scaledValue(6),
            },
          ]}
        />
      )}
      {dashBoard && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: scaledValue(12),
            gap: scaledValue(8),
          }}>
          <GButton
            onPress={() => {}}
            icon={Images.CircleClose}
            iconStyle={styles.iconStyle}
            title={t('cancel_string')}
            textStyle={[styles.buttonText, {color: colors.jetBlack}]}
            style={[
              {
                backgroundColor: 'transparent',
                marginBottom: scaledValue(0),
                gap: scaledValue(6),
                borderWidth: scaledValue(1),
                height: scaledValue(47),
                flex: 1,
              },
            ]}
          />
          <GButton
            onPress={() => {
              if (monthly) {
                navigation?.navigate('StackScreens', {
                  screen: 'BookAppointment',
                });
              }
            }}
            icon={Images.rechedule}
            iconStyle={styles.iconStyle}
            title={t('reschedule_string')}
            textStyle={[styles.buttonText, {color: colors.paletteWhite}]}
            style={[
              {
                height: scaledValue(47),
                borderRadius: scaledValue(28),
                // marginHorizontal: scaledValue(12),
                alignItems: 'center',
                gap: scaledValue(6),
                flex: 1,
              },
            ]}
          />
        </View>
      )}
      <View
        // colors={['#D04122', '#FDBD74']}
        // start={{x: 0, y: 1}}
        // end={{x: 1, y: 1}}
        style={{
          borderRadius: scaledValue(16),
          position: 'absolute',
          top: scaledValue(-16),
          alignSelf: 'flex-end',
          right: scaledValue(16),
          width: scaledValue(32),
          height: scaledValue(32),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:colors.blue,
        }}>
        <GImage
          image={petImage}
          style={{
            width: scaledValue(30),
            height: scaledValue(30),
            borderRadius: scaledValue(16),
          }}
        />
      </View>
    </View>
  );
};

export default AppointmentCard;
