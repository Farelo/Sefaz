const soap = require('soap')
const url = 'https://{soap-server}:{port}/LoyaltyMemberService?wsdl'
// const ErrorCodes

class ServiceEngine {
 async engineEntry(memberId, loyProgramName) {
  let me = this
  let requestInput = {
   loyProgramName: loyProgramName,
   memberId: CustomerNumber,
  }
  var argsxml = this._updateMemberClassXml(requestInput)
  return new Promise((resolve, reject) => {
   soap.createClient(url, {wsdl_headers: {Authorization: auth}}, function(err, client) {
    if (err) {
     me._logger.error(`Cannot connect to remote soap url: ${url}`, err)
     return reject(ErrorCodes['5005'])
    }
    client.updateAllMember_V01(argsxml, function(methodCallError, result) {
        try {
         programMember = me._updateMemberClassResult(result)
        } catch (err) {
         me._logger.error(`Failed to enroll $${memberId} for ${loyProgramName} with result ${JSON.stringify(result)}`, err)
         return reject(ErrorCodes['5006'])
        }
        me._logger.info(`Member $${memberId} successfully enrolled for ${loyProgramName}`)
        return resolve(programMember)
       })
      })
     })
    }
    _updateMemberClassResult(result) {
        let origin = result.ListOfLoymember.MemberV01extOut.UpdateMemberOut
        let response = {
         'customerId': origin['CustomerId'],
        }
        return response
       }

       _updateMemberClassXml(requestInput) {
        return {
         _xml: '<cus:updateAllMember_V01_Input xmlns:cus="http://siebel.com/CustomUI"  xmlns:mg="http://www.siebel.com/xml/MG_loyMemberService_updateAllMember_V01_extIn">' +
          '<mg:ListOfLoymemberserviceupdateAllMemberV01extIn><mg:UpdateAllMemberIn>' +
          `<mg:CustomerNumber>${requestInput.membererId}</mg:CustomerNumber>` +
          `<mg:MemberClass>${requestInput.loyProgramName}</mg:MemberClass></mg:UpdateAllMemberIn>` +
          '</mg:ListOfLoymemberserviceupdateAllMemberV01extIn></cus:updateAllMember_V01_Input>'
        }
       }
      }
      module.exports = LoyaltyRestService


