import { Router } from 'express';
import { isAuthenticated } from '../middlewares';

import * as admin from '../controllers/admin';
import * as card from '../controllers/card';
import * as stripe from '../controllers/stripe';
import * as auth from '../controllers/auth';
import * as family from '../controllers/family';
import * as hooks from '../controllers/hooks';

const userRoutes = Router();

userRoutes.post('/register', auth.registerUsers);
userRoutes.get('/emailVerify', auth.emailVerify);
userRoutes.post('/otp/verify', auth.otpVerify);
userRoutes.post('/otp/resend', auth.resendOtp);
userRoutes.post('/email/resend', auth.resendEmailUrl);
userRoutes.post('/login', auth.loginUser);
userRoutes.post('/forgetPassword', auth.forgetPassword);
userRoutes.post('/forgetChangePassword', auth.forgetChangePassword);
userRoutes.get('/forgetPasswordVerify', auth.forgetPasswordVerify);
userRoutes.get('/logout', isAuthenticated, auth.logout);
userRoutes.get('/card', isAuthenticated, card.listCard);
userRoutes.post('/active-card', isAuthenticated, card.activateCard);
userRoutes.post('/child/active-card', isAuthenticated, card.activateCardByChild);
userRoutes.post('/reactive-card', isAuthenticated, card.reactivateCard);
userRoutes.post('/lock-card', isAuthenticated, card.lockCard);
userRoutes.get('/child-side/transaction/history', isAuthenticated, card.transactionHistoryForChild);
userRoutes.post('/create-cvv', isAuthenticated, card.createCvv);
userRoutes.get('/delete-card-request', isAuthenticated, card.deleteCardRequest);
userRoutes.delete('/delete-card/:id', isAuthenticated, card.deleteCard);
userRoutes.get('/stripe/card/list', isAuthenticated, card.listStripeCard)
userRoutes.get('/child/card/transaction/history', isAuthenticated, card.getChildCardTransactionHistory);

userRoutes.post('/child/new-card-activate', isAuthenticated, family.childNewCardActivate)
userRoutes.get('/child/dashboard', isAuthenticated, family.childDashboard)
userRoutes.get('/child/earning', isAuthenticated, family.childEarnigs)
userRoutes.put('/child/update', isAuthenticated, family.updateChild);
userRoutes.delete('/child/:id', isAuthenticated, family.removeChild);
userRoutes.post('/child/verify/otp', isAuthenticated, family.otpVerifyForChild);
userRoutes.post('/child/otp/send', isAuthenticated, family.sendOtpForChild);
userRoutes.post('/child/otp/resend', isAuthenticated, family.resendOtpForChild);
userRoutes.get('/child/task/list', isAuthenticated, family.listTaskChild);
userRoutes.get('/child/task/special', isAuthenticated, family.specialRewards);
userRoutes.post('/child/card/topup', isAuthenticated, family.addBalanceToChildCard);

userRoutes.post('/user/setup-payment-method', isAuthenticated, family.setupPaymentMethod)
userRoutes.post('/user/updateUser', isAuthenticated, family.updateUser);
userRoutes.get('/user/child/info', isAuthenticated, family.childList);
userRoutes.post('/user/child/spend-limit', isAuthenticated, family.childSpendLimit);
userRoutes.post('/user/child/allowance-set', isAuthenticated, family.childAllowanceSet);
userRoutes.post('/task/reward/send', isAuthenticated, family.rewardSend);
userRoutes.post('/user/task/add', isAuthenticated, family.addTask);
userRoutes.get('/user/task/list', isAuthenticated, family.listTask);
userRoutes.get('/user/task/unread', isAuthenticated, family.unreadTask);
userRoutes.post('/user/task/accept', isAuthenticated, family.acceptTask);
userRoutes.get('/user/task/read/:id', isAuthenticated, family.makeReadTask);
userRoutes.get('/user/task/:id', isAuthenticated, family.detailTask);
userRoutes.put('/user/task/:id', isAuthenticated, family.updateTask);
userRoutes.get('/user/detail', isAuthenticated, family.userDetail);
userRoutes.get('/user/category', isAuthenticated, admin.listCategory);
userRoutes.get('/user/notification/list', isAuthenticated, family.notificationList);
userRoutes.get('/notification/count', isAuthenticated, family.notificationCount);
userRoutes.put('/user/notification/read', isAuthenticated, family.notificationRead);

userRoutes.get('/event/parent/list', isAuthenticated, family.listEventParentSide);
userRoutes.get('/event/child/list', isAuthenticated, family.listEventChildSide);
userRoutes.get('/event/child/details/:id', isAuthenticated, family.eventDetails);
userRoutes.post('/event/add', isAuthenticated, family.addEvent)
userRoutes.post('/event/accept', isAuthenticated, family.acceptEvent)

userRoutes.post('/saving/add', isAuthenticated, family.addSaving);
userRoutes.post('/saving/transfer-to-saving-category', isAuthenticated, family.transferToSavingCategory);
userRoutes.post('/saving/transfer-to-default-category', isAuthenticated, family.transferToDefaultCategory);
userRoutes.get('/saving/list', isAuthenticated, family.listSaving);
userRoutes.get('/saving/parent/list', isAuthenticated, family.listSavingForParent);
userRoutes.get('/saving/detail/:id', isAuthenticated, family.detailSaving);
userRoutes.get('/saving/favorite/:id', isAuthenticated, family.markFavorite);
userRoutes.get("/education/list", isAuthenticated, family.listEducation)
userRoutes.get("/education/favorite/:id", isAuthenticated, family.educationFavorite)


userRoutes.post('/user/stripeToken/save', isAuthenticated, stripe.saveStripeToken);
userRoutes.get('/stripe/transaction/history', isAuthenticated, stripe.stripeTransactionHistory)
userRoutes.post('/wallet/topup', isAuthenticated, stripe.walletTopup);
userRoutes.get("/stripe/subscription", stripe.subscriptionPlanList)
userRoutes.post("/stripe/subscription", isAuthenticated, stripe.subscribeUser)
userRoutes.put("/stripe/subscription", isAuthenticated, stripe.upgradeSubscribeUser)

// chat url 
userRoutes.get("/room/list", isAuthenticated, family.roomList)
userRoutes.get("/chat/list", isAuthenticated, family.chatList)
userRoutes.get("/child/chat/list", isAuthenticated, family.childRoomList)

// IPIN
userRoutes.get("/send-ipin-otp", isAuthenticated, family.sendIpinOtp)
userRoutes.post("/generate-ipin", isAuthenticated, family.generateIpin)

// gift url 
userRoutes.post('/user/search', family.seachParent)
userRoutes.post('/payGift', family.payGift)
//review
userRoutes.get('/web/review', family.listReview)
userRoutes.post('/web/review', family.addReview)

//cron tab url 
userRoutes.get('/auto-add-balance-to-child-card', family.autoAddBalanceToChildCard)
userRoutes.get('/reset-child-limit', family.resetChildLimit)
userRoutes.get('/task-reminder', family.taskReminder)

/*********************************  HOOKS URL *****************************/

userRoutes.post('/mm/pre-authorization-hook', hooks.spendLimitCheck)
userRoutes.post('/mm/post-authorization-hook', hooks.spendingNotification)

userRoutes.post('/stripe/hook/invoice-paid', hooks.invoicePaid)
userRoutes.post('/stripe/hook/subscription-deleted', hooks.subscriptionDeleted)


export default userRoutes;