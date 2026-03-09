using API.Controllers.Base;
using DAL.Entity.Member;
using Microsoft.AspNetCore.Connections;
using Microsoft.AspNetCore.Mvc;
using SERVICE.IService.Member;
using SERVICE.IService.Role;

namespace API.Controllers.Member
{
    [ApiController]
    [Route("api/member")]
    public class MemberController : BaseController<MemberEntity, MemberDto>
    {
        /// <summary>
        /// khai báo service riêng cho member
        /// </summary>
        private readonly IMemberService _service;
        public MemberController(IMemberService MemberService) : base(MemberService)
        {
            _service = MemberService;
        }

    }
}
