var homePageController = startupSmb.controller('homePageController',
    ['$scope', '$uibModal', '$timeout', 'serviceForApiCall', '$cookies', '$rootScope', '$interval',
        function ($scope, $uibModal, $timeout, serviceForApiCall, $cookies, $rootScope, $interval) {


            $scope.userLoggedIn = false;
            $rootScope.loader = true;


            $timeout(function () {
                $rootScope.loader = false;
                if (!$scope.userLoggedIn && $('.signupModal').length == 0) {
                    $scope.openRegisterModal();
                }
            }, 1000);

            //if user went without register show popup every after 10 min
            var showModal = $interval(function () {
                if (!$scope.userLoggedIn && $('.signupModal').length == 0) {
                    $scope.openRegisterModal();
                } else {
                    $interval.cancel(showModal);
                }
            }, 600000);

            //google
            var gInit = $interval(function () {
                if (gapi) {
                    gapi.load('auth2', function () {//load in the auth2 api's, without it gapi.auth2 will be undefined
                        gapi.auth2.init(
                            {
                                client_id: '454365355426-pbv3s7e3vtogppgfkavva2kbcasl6d26.apps.googleusercontent.com'
                            }
                        );
                        //get's a GoogleAuth instance with your client-id, needs to be called after gapi.auth2.init
                        $rootScope.GoogleAuth = gapi.auth2.getAuthInstance();
                        $rootScope.GoogleAuth.currentUser.listen(function (currentUser) {
                                if (currentUser.w3) {
                                    if (currentUser) {
                                        var data = {
                                            username: currentUser.w3.U3,
                                            email: currentUser.w3.ofa + ' ' + currentUser.w3.wea,
                                            source: "google"
                                        };
                                        saveUserData(data);
                                        $scope.userLoggedIn = true;
                                    }
                                }
                            }
                        );
                        $interval.cancel(gInit);
                    });
                }
            }, 500);

            //FB code
            window.fbAsyncInit = function () {
                // FB JavaScript SDK configuration and setup
                FB.init({
                    appId: '259601401238503', // FB App ID
                    cookie: true,  // enable cookies to allow the server to access the session
                    xfbml: true,  // parse social plugins on this page
                    version: 'v2.8' // use graph api version 2.8
                });

                // Check whether the user already logged in
                FB.getLoginStatus(function (response) {
                    if (response.status === 'connected') {
                        getFbUserData();
                        $scope.userLoggedIn = true;
                    } else if ($cookies.get('loggedIn')) {
                        $scope.userLoggedIn = true;
                    }
                });
            };

            $scope.openRegisterModal = function () {
                $uibModal.open({
                    templateUrl: 'signupModal.html',
                    controller: ['$scope', '$uibModalInstance', 'serviceForApiCall', 'md5', '$cookies', '$timeout',
                        function ($scope, $uibModalInstance, serviceForApiCall, md5, $cookies, $timeout) {
                            $scope.emailRegEx = /^[a-z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]{0,4}$/;
                            $scope.passwordRegEx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})");

                            $scope.loginState = 'signup';

                            $scope.signUp = function () {
                                var data = angular.extend({"source": "self"}, $scope.signUpDetails);
                                saveUserData(data);
                                var expireDate = new Date();
                                //after 5 hrs automatically signout
                                expireDate.setTime(expireDate.getTime() + (300 * 60 * 1000));
                                $cookies.put('loggedIn', true, {'expires': expireDate});
                                $scope.signUpDetails = {};
                                $scope.userLoggedIn = true;
                                $uibModalInstance.close();
                            };

                            $scope.continueWithGoogle = function () {
                                //add a function to the controller so ng-click can bind to it
                                $rootScope.GoogleAuth.signIn().then(function (response) {//request to sign in
                                    var data = {
                                        username: response.w3.U3,
                                        email: response.w3.ofa + ' ' + response.w3.wea,
                                        source: "google"
                                    };
                                    $scope.userLoggedIn = true;
                                    saveUserData(data);
                                    $uibModalInstance.close();
                                });
                            };

                            /*  $scope.signUp = function () {
                                  var data = angular.extend({}, $scope.signUpDetails);
                                  data.password = md5.createHash(data.password);
                                  $scope.signupLoader = true;
                                  serviceForApiCall.signUp(data).then(function (response) {
                                      var expireDate = new Date();
                                      //after 5 hrs automatically signout
                                      expireDate.setTime(expireDate.getTime() + (300 * 60 * 1000));
                                      $cookies.put('loggedIn', true, {'expires': expireDate});
                                      $scope.info = response.data.message;
                                      $uibModalInstance.close();
                                      $scope.signUpDetails = {};
                                      $scope.submit = false;
                                      $scope.signupLoader = false;
                                  }, function (error) {
                                      if (error.data.status == 409) {
                                          $scope.error = "User already exist.Try with another email Id "
                                      } else {
                                          $scope.error = 'Something went wrong.'
                                      }
                                      $scope.submit = false;
                                      $scope.signupLoader = false;
                                  })
                              };

                              $scope.signIn = function () {
                                  var data = angular.extend({}, $scope.signInDetails);
                                  data.password = md5.createHash(data.password);
                                  $scope.signupLoader = true;
                                  serviceForApiCall.login(data).then(function (response) {
                                      var expireDate = new Date();
                                      //after 5 hrs automatically signout
                                      expireDate.setTime(expireDate.getTime() + (300 * 60 * 1000));
                                      $cookies.put('loggedIn', true, {'expires': expireDate});
                                      $uibModalInstance.close();
                                      $scope.signInDetails = {};
                                      $scope.submit = false;
                                      $scope.signupLoader = false;
                                  }, function (error) {
                                      if (error.data.status == 401) {
                                          $scope.error = 'Incorrect password';
                                      } else {
                                          $scope.error = 'Something went wrong.'
                                      }
                                      $scope.submit = false;
                                      $scope.signupLoader = false;
                                  })
                              };*/

                            $scope.continueWithFb = function () {
                                FB.login(function (response) {
                                    if (response.authResponse) {
                                        // Get and display the user profile data
                                        getFbUserData();
                                        $uibModalInstance.close();
                                    } else {
                                        console.log('User cancelled login or did not fully authorize.');
                                    }
                                }, {scope: 'email'});
                            };

                            $scope.toggleLogin = function (state) {
                                $scope.signInDetails = {};
                                $scope.signUpDetails = {};
                                $scope.loginState = state;
                                $scope.error = "";
                                $scope.info = "";
                            }

                            $scope.close = function () {
                                $uibModalInstance.close();
                            }
                        }],
                    backdrop: 'static',
                    windowClass: "signupModal",
                    keyboard: false,
                    animation: true

                }).result.then(function (data) {
                });
            };

            // Load the JavaScript SDK asynchronously
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

            // Fetch the user profile data from facebook
            function getFbUserData() {
                FB.api('/me', {locale: 'en_US', fields: 'id,first_name,last_name,email,link,gender,locale,picture'},
                    function (response) {
                        console.log(response);
                        var userData = {
                            "email": response.email,
                            "username": response.first_name + ' ' + response.last_name,
                            "source": "FB"
                        };
                        saveUserData(userData);
                    });
            }

            //send data to backend
            function saveUserData(data) {
                $.post({
                    url: "http://smbstartuppack-dot-datatest-148118.appspot.com/smb/registeruser",
                    method: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (res) {
                        console.log(res);
                        $scope.signUpDetails = {};
                    }
                });
            }

            // Logout from facebook
            function fbLogout() {
                /*  FB.logout(function () {
                      document.getElementById('fbLink').setAttribute("onclick", "fbLogin()");
                      document.getElementById('fbLink').innerHTML = '<img src="fblogin.png"/>';
                      document.getElementById('userData').innerHTML = '';
                      document.getElementById('status').innerHTML = 'You have successfully logout from Facebook.';
                  });*/
            }

            $scope.profiles = [
                {
                    "name": "Small Business Owner in Retail and Online",
                    "icon": "Small Business ownerimage.png",
                    "desc": "Mike owns a small brick-and-mortar store and sells online. He is not technology shy and is looking for solutions to scale his business",
                    "questions": [
                        "How do I get discovered and grow more customers – offline & online?",
                        "How do I reduce complexity of managing multiple ECom marketplaces? Can I sell globally?",
                        "How do I reduce my shipping costs and manage returns?"
                    ],
                    "similarProfiles": [
                        "Fashion boutiques & retailers",
                        "Small sized traders and exporters"
                    ]
                },
                {
                    "name": "Small Professional services firm",
                    "icon": "Small professional services firm image.png",
                    "desc": "Flourishing services business with 1-2 owners & 3-4 support staff. Looking for solutions to enhance productivity & manage practice better",
                    "questions": [
                        "How do I manage my practice better? Appointment management, scheduling and payments",
                        "Do I know my customers well enough? How do I grow them?",
                        "Which solutions can I use to manage my documents and increase productivity"
                    ],
                    "similarProfiles": [
                        "Accounting, & Legal firms",
                        "Healthcare Professionals",
                        "Small Consulting firms"
                    ]
                },
                {
                    "name": "Mid-sized manufacturers",
                    "icon": "mid sized manufacturer image.png",
                    "desc": "Directors/ department heads of mid-sized manufacturing company. Looking for more customer insights to manage his relationships better",
                    "questions": [
                        "Which are the tools to enhance my customer insights and manage relationships",
                        "How can I manage my documents securely and reduce shipping costs",
                        "How do I improve my business productivity?"
                    ],
                    "similarProfiles": [
                        "Small sized real-estate, manufacturing",
                        "Distributors"
                    ]
                },
                {
                    "name": "Small hyperlocal food delivery business",
                    "icon": "pizza.png",
                    "desc": "Ben is an owner of a popular local Pizzeria. His sales are predominantly offline with a growing online delivery business",
                    "questions": [
                        "How do I get discovered locally and target my customers?",
                        "How can I scale my delivery business?",
                        "What can I do to reduce my costs and drive more efficiency?"
                    ],
                    "similarProfiles": [
                        "Small food outlets",
                        "Local service businesses: laundry, groceries & home services"
                    ]
                }
            ];


            $(document).ready(function () {

                $(".single-item").slick();

                $(".single-item2").slick({
                    autoplay: true,
                    autoplaySpeed: 1000,
                    dots: true,
                    arrows: false
                });

                $('.multiple-items').slick({
                    infinite: true,
                    slidesToShow: 5,
                    slidesToScroll: 5

                });
            });

        }
    ]);