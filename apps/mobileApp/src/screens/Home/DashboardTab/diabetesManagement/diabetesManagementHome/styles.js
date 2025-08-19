import { Dimensions, Platform, StyleSheet } from 'react-native';
import { colors } from '../../../../../../assets/colors';
import {
  scaledHeightValue,
  scaledValue,
} from '../../../../../utils/design.utils';
import { fonts } from '../../../../../utils/fonts';

export const styles = StyleSheet.create({
  dashboardMainView: {
    flex: 1,
    backgroundColor: colors.themeColor,
  },
  petListContainer: {
    marginTop: scaledValue(18),
    marginBottom: scaledValue(62),
  },
  petList: {
    gap: scaledValue(16),
  },
  petItem: {},
  petImage: {
    width: scaledValue(80),
    height: scaledValue(80),
  },
  petNameText: {
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(19.2),
    marginTop: scaledValue(4),
    letterSpacing: scaledValue(16 * -0.02),

    textAlign: 'center',
  },
  healthyStatus: {
    flexDirection: 'row',
    backgroundColor: '#8AC1B1',
    paddingHorizontal: scaledValue(10),
    height: scaledValue(24),
    alignItems: 'center',
    borderRadius: scaledValue(20),
    marginTop: scaledValue(4),
  },
  riskStatus: {
    flexDirection: 'row',
    backgroundColor: colors.appRed,
    paddingHorizontal: scaledValue(10),
    height: scaledValue(24),
    alignItems: 'center',
    borderRadius: scaledValue(20),
    marginTop: scaledValue(4),
  },
  statusIcon: {
    width: scaledValue(12),
    height: scaledValue(12),
    marginRight: scaledValue(1),
  },
  statusText: {
    fontSize: scaledValue(12),
    lineHeight: scaledHeightValue(14),
    letterSpacing: scaledValue(12 * -0.02),
    color: colors.white,
    marginLeft: scaledValue(1),
    top: scaledValue(1),
  },
  diabeteslogText: {
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(19.2),
    letterSpacing: scaledValue(16 * -0.02),
    opacity: 0.6,
    marginBottom: scaledValue(8),
  },
  quickActionItem: {
    backgroundColor: '#FFF6EB',
    width: Dimensions.get('window').width / 2 - scaledValue(30),
    // height: scaledValue(157),
    paddingHorizontal: scaledValue(16),
    borderRadius: scaledValue(20),
    shadowColor: '#47382726',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    paddingBottom: scaledValue(20),
    marginTop: scaledValue(12),
  },
  quickActionImage: {
    width: scaledValue(40),
    height: scaledValue(40),
    marginTop: scaledValue(39),
  },
  quickActionText: {
    fontSize: scaledValue(18),
    lineHeight: scaledHeightValue(21.6),
    marginTop: scaledValue(14),
    letterSpacing: scaledValue(18 * -0.01),
  },
  containerView: {
    paddingHorizontal: scaledValue(20),
    marginTop: scaledValue(21),
  },
  headerTitle: {
    fontSize: scaledValue(18),
    lineHeight: scaledHeightValue(21.6),

    letterSpacing: scaledValue(18 * -0.01),
  },
  headerImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catImage: {
    width: scaledValue(40),
    height: scaledValue(40),
    marginRight: scaledValue(3),
  },
  arrowDownImage: {
    width: scaledValue(16),
    height: scaledValue(16),
    marginLeft: scaledValue(1),
  },
  bloodGulcoseButton: {
    borderWidth: scaledValue(0.5),
    height: scaledValue(36),
    width: scaledValue(147),
    borderRadius: scaledValue(24),
    paddingHorizontal: scaledValue(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bloodGulcoseText: {
    fontSize: scaledValue(14),
    lineHeight: scaledHeightValue(16.8),
    letterSpacing: scaledValue(16 * -0.03),

  },
  arrowIcon: {
    width: scaledValue(20),
    height: scaledValue(20),
  },
  bloodGulcoseButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaledValue(12),
    // paddingVertical: scaledValue(6),
  },
  buttonIcon: {
    width: scaledValue(20),
    height: scaledValue(20),
    marginRight: scaledValue(3),
  },
  button: {
    height: scaledValue(48),
    width: scaledValue(198),
    alignSelf: 'center',
    backgroundColor: colors.jetBlack,
    borderRadius: scaledValue(28),
    marginBottom: scaledValue(60),
  },
  buttonText: {
    fontSize: scaledValue(18),
    lineHeight: scaledHeightValue(18),
    letterSpacing: scaledValue(18 * -0.01),
    fontFamily: fonts?.CLASH_GRO_MEDIUM,
    color: colors.white,
    marginLeft: scaledValue(3),
    top: scaledValue(2),
    textTransform: 'capitalize',
  },
  graphMainView: {
    backgroundColor: '#FFF6EB',
    height: scaledValue(280),
    marginBottom: scaledValue(40),
    shadowColor: '#47382726',
    shadowOffset: { width: 1, height: scaledValue(2) },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 8,
    borderRadius: scaledValue(13.36),
    paddingVertical: scaledValue(20),
    paddingHorizontal: scaledValue(11.43),
  },
});
