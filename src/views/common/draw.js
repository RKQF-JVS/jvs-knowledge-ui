import { consoleDraw } from '@/util/util'
export const declare = () => {
  consoleDraw('%c此框架为公共免费使用，为保证大家有一个流畅的使用环境，特此将所有网络请求QPS进行限制， 如果发现长期存在恶意或爆破行为，则将禁封IP，或直接将此平台进行下架，开源不易希望共同维护。', 
  ['font-size: 12px;color: #7266d5;'])
  consoleDraw('%cw%cy%cQ%cA%cQ', [
    'color: #224380;font-size: 20px;margin-right: 5px;font-weight: 600;', 
    'color: #58A7F2;font-size: 20px;', 
    'font-size: 24px;background: #F4605F;color: #fff;padding: 5px;', 
    'border: 1px solid #8F4CFF;padding: 5px;border-radius: 50%;',
    'font-size: 24px;background: #F4605F;color: #fff;padding: 5px;'
  ])
}