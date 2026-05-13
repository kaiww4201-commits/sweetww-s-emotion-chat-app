import os
import dashscope

# 设置API Key
dashscope.api_key = os.getenv("DASHSCOPE_API_KEY")

# 检查API Key是否设置成功
if not dashscope.api_key:
    print("错误：请先设置 DASHSCOPE_API_KEY 环境变量")
    print("方法：在命令行输入 setx DASHSCOPE_API_KEY '你的Key' 然后重启命令行")
    exit()

print("=" * 50)
print("哈喽亭葳！你的AI小比 已启动")
print("输入你想问的问题，输入 exit 退出")
print("=" * 50)
print()

while True:
    # 获取用户输入
    user_input = input("你：")
    
    # 退出条件
    if user_input.lower() in ["exit", "quit", "退出"]:
        print("再见！")
        break
    
    # 跳过空输入
    if not user_input.strip():
        continue
    
    print("AI：", end="", flush=True)
    
    try:
        # 调用大模型
        response = dashscope.Generation.call(
            model="qwen-turbo",
            messages=[
                {"role": "system", "content": "你是一个擅长沟通，幽默风趣，耐心温暖，情绪稳定，擅长回答生活困惑等问题。回答要有帮助。"},
                {"role": "user", "content": user_input}
            ],
            result_format="message"
        )
        
        # 输出结果
        if response.status_code == 200:
            answer = response.output.choices[0].message.content
            print(answer)
        else:
            print(f"调用失败：{response.message}")
            
    except Exception as e:
        print(f"出错了：{e}")
    
    print()  # 打印空行，让对话更清晰
